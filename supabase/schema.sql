-- =====================================================================
-- Document Request Portal — MVP schema (Supabase / PostgreSQL)
-- Run this whole file in Supabase > SQL Editor
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Request status ----------
create type request_status as enum (
  'submitted',        -- request submitted
  'reviewing',        -- under review by staff
  'need_more_info',   -- applicant must correct or add information
  'approved',         -- approved
  'processing',       -- document being prepared
  'ready',            -- ready for pickup / dispatch
  'completed',        -- collected / delivered
  'rejected',         -- rejected
  'cancelled'         -- cancelled
);

-- ---------- Registrar staff ----------
create table staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create or replace function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff where user_id = auth.uid());
$$;

-- ---------- 1) request_types ----------
create table request_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  fee numeric(10,2) not null default 0,
  processing_days int not null default 3,
  required_documents text,           -- free text: what the applicant must attach
  name_th text,                      -- optional Thai versions, shown when the UI language is Thai
  description_th text,
  required_documents_th text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 2) requests ----------
create table requests (
  id uuid primary key default gen_random_uuid(),
  tracking_code text not null unique
    default ('DR-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8))),
  request_type_id uuid not null references request_types(id),
  requester_name text not null,
  student_id text not null,
  email text,
  phone text,
  purpose text,
  copies int not null default 1 check (copies between 1 and 20),
  delivery_method text not null default 'pickup' check (delivery_method in ('pickup','mail')),
  address text,
  status request_status not null default 'submitted',
  staff_note text,                   -- message from staff (visible to the applicant)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on requests (status, created_at desc);
create index on requests (student_id);

-- ---------- 3) attachments ----------
create table attachments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  file_path text not null,           -- path inside the request-files storage bucket
  file_name text not null,
  file_type text,
  file_size int,
  uploaded_at timestamptz not null default now()
);
create index on attachments (request_id);

-- ---------- 4) status_history ----------
create table status_history (
  id bigint generated always as identity primary key,
  request_id uuid not null references requests(id) on delete cascade,
  status request_status not null,
  note text,
  changed_by uuid references auth.users(id),
  changed_at timestamptz not null default now()
);
create index on status_history (request_id, changed_at);

-- ---------- Triggers: automatic status history ----------
create or replace function log_request_status() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into status_history (request_id, status, note)
  values (new.id, new.status, 'Request submitted');
  return new;
end $$;

create trigger trg_requests_ins after insert on requests
  for each row execute function log_request_status();

create or replace function touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at := now(); return new; end $$;

create trigger trg_requests_touch before update on requests
  for each row execute function touch_updated_at();

create or replace function log_request_status_upd() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status then
    insert into status_history (request_id, status, note, changed_by)
    values (new.id, new.status, new.staff_note, auth.uid());
  end if;
  return new;
end $$;

create trigger trg_requests_upd after update on requests
  for each row execute function log_request_status_upd();

-- ---------- Row Level Security ----------
alter table staff          enable row level security;
alter table request_types  enable row level security;
alter table requests       enable row level security;
alter table attachments    enable row level security;
alter table status_history enable row level security;

create policy "staff read self" on staff for select using (user_id = auth.uid());

create policy "public read active types" on request_types
  for select using (active or is_staff());
create policy "staff manage types" on request_types
  for all using (is_staff()) with check (is_staff());

create policy "staff read requests"    on requests       for select using (is_staff());
create policy "staff update requests"  on requests       for update using (is_staff());
create policy "staff read attachments" on attachments    for select using (is_staff());
create policy "staff read history"     on status_history for select using (is_staff());

-- Applicants (not signed in) only use the RPC functions below.

-- ---------- RPC: submit a request ----------
create or replace function submit_request(
  p_request_type_id uuid,
  p_requester_name text,
  p_student_id text,
  p_email text,
  p_phone text,
  p_purpose text,
  p_copies int,
  p_delivery_method text,
  p_address text
) returns text
language plpgsql security definer set search_path = public as $$
declare v_code text;
begin
  if coalesce(trim(p_requester_name),'') = '' or coalesce(trim(p_student_id),'') = '' then
    raise exception 'Full name and student ID are required';
  end if;
  if not exists (select 1 from request_types where id = p_request_type_id and active) then
    raise exception 'Document type not found';
  end if;
  if p_delivery_method = 'mail' and coalesce(trim(p_address),'') = '' then
    raise exception 'A delivery address is required for mail delivery';
  end if;

  insert into requests (request_type_id, requester_name, student_id, email, phone,
                        purpose, copies, delivery_method, address)
  values (p_request_type_id, trim(p_requester_name), trim(p_student_id), nullif(trim(p_email),''),
          nullif(trim(p_phone),''), nullif(trim(p_purpose),''),
          greatest(1, least(coalesce(p_copies,1), 20)), p_delivery_method, nullif(trim(p_address),''))
  returning tracking_code into v_code;
  return v_code;
end $$;

-- ---------- RPC: register an attachment (after upload to storage) ----------
create or replace function add_attachment(
  p_tracking_code text, p_file_path text, p_file_name text, p_file_type text, p_file_size int
) returns void
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  select id into v_id from requests
   where tracking_code = p_tracking_code and status in ('submitted','need_more_info');
  if v_id is null then raise exception 'Files cannot be attached to this request'; end if;
  if left(p_file_path, length(p_tracking_code) + 1) <> p_tracking_code || '/' then
    raise exception 'Invalid file path';
  end if;
  insert into attachments (request_id, file_path, file_name, file_type, file_size)
  values (v_id, p_file_path, p_file_name, p_file_type, p_file_size);
end $$;

-- ---------- RPC: track a request (needs tracking code AND student ID) ----------
create or replace function track_request(p_tracking_code text, p_student_id text)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'tracking_code', r.tracking_code,
    'type_name', t.name,
    'type_name_th', t.name_th,
    'requester_name', r.requester_name,
    'copies', r.copies,
    'delivery_method', r.delivery_method,
    'status', r.status,
    'staff_note', r.staff_note,
    'created_at', r.created_at,
    'history', coalesce((
      select jsonb_agg(jsonb_build_object('status', h.status, 'note', h.note, 'changed_at', h.changed_at)
                       order by h.changed_at)
      from status_history h where h.request_id = r.id), '[]'::jsonb)
  )
  from requests r join request_types t on t.id = r.request_type_id
  where r.tracking_code = upper(trim(p_tracking_code))
    and r.student_id = trim(p_student_id);
$$;

grant execute on function submit_request, add_attachment, track_request to anon, authenticated;

-- ---------- Storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('request-files', 'request-files', false, 5242880,
        array['application/pdf','image/jpeg','image/png'])
on conflict (id) do nothing;

create policy "anyone upload request files" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'request-files');
create policy "staff read request files" on storage.objects
  for select to authenticated using (bucket_id = 'request-files' and is_staff());

-- ---------- Sample data ----------
insert into request_types
  (name, description, fee, processing_days, required_documents, name_th, description_th, required_documents_th, sort_order) values
 ('Enrollment Verification Certificate', 'Confirms current enrollment status', 0, 2, 'Copy of student ID card',
  'ใบรับรองสถานภาพนักเรียน/นักศึกษา', 'ใช้ยืนยันสถานะการศึกษาปัจจุบัน', 'สำเนาบัตรนักเรียน/นักศึกษา', 1),
 ('Official Transcript', 'Academic record, English or local language', 50, 5, 'Copy of national ID or passport',
  'ใบแสดงผลการเรียน (Transcript)', 'ฉบับภาษาไทยหรือภาษาอังกฤษ', 'สำเนาบัตรประชาชนหรือหนังสือเดินทาง', 2),
 ('Certificate of Enrollment (Visa / Scholarship)', 'For visa or scholarship applications', 30, 3, 'Copy of passport (if available)',
  'หนังสือรับรองการเป็นนักศึกษา (สำหรับวีซ่า/ทุน)', 'สำหรับยื่นขอวีซ่าหรือทุนการศึกษา', 'สำเนาหนังสือเดินทาง (ถ้ามี)', 3),
 ('Other Document', 'Describe your request in the purpose field', 0, 7, null,
  'เอกสารอื่น ๆ', 'ระบุรายละเอียดในช่องวัตถุประสงค์', null, 9);

-- Create a staff account: first add a user under Authentication > Users, then run:
-- insert into staff (user_id, display_name) values ('<USER UUID>', 'Registrar Staff');
