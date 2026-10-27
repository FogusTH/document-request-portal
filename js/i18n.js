/* Language support (Thai / English).
   To add a language: add a new block to DICT with the same keys and add its code to LANGS. */

export const LANGS = [
  { code: "th", label: "ไทย", locale: "th-TH" },
  { code: "en", label: "EN", locale: "en-GB" },
];
const DEFAULT_LANG = "th";

const DICT = {
  th: {
    "nav.brand": "ระบบขอเอกสารออนไลน์",
    "nav.request": "ยื่นคำร้อง",
    "nav.track": "ติดตามสถานะ",
    "nav.staff": "เจ้าหน้าที่",

    "common.loading": "กำลังโหลด…",
    "common.notConfigured": "ยังไม่ได้ตั้งค่า Supabase",
    "common.notConfiguredBody": "เปิดไฟล์ <code>js/config.js</code> แล้วแก้ค่า <code>SUPABASE_URL</code> และ <code>SUPABASE_ANON_KEY</code>",

    "home.sub": "ขอเอกสารทางการได้ออนไลน์ ยื่นคำร้อง แนบไฟล์ และติดตามสถานะได้จากทุกอุปกรณ์",
    "home.students": "สำหรับนักเรียน/นักศึกษา",
    "home.btnRequest": "ยื่นคำร้องขอเอกสาร",
    "home.btnTrack": "ติดตามสถานะ",
    "home.staff": "สำหรับเจ้าหน้าที่ทะเบียน",
    "home.btnStaff": "เข้าสู่ระบบเจ้าหน้าที่",

    "req.title": "ยื่นคำร้องขอเอกสาร",
    "req.loadFail": "โหลดข้อมูลไม่สำเร็จ: {msg}",
    "req.s1": "1. เลือกเอกสาร",
    "req.selectType": "— เลือกประเภทเอกสาร —",
    "req.info": "{desc} · ค่าธรรมเนียม {fee} บาท/ฉบับ · ใช้เวลาประมาณ {days} วันทำการ",
    "req.required": "เอกสารที่ต้องแนบ: {docs}",
    "req.s2": "2. ข้อมูลผู้ยื่น",
    "req.name": "ชื่อ-นามสกุล *",
    "req.sid": "รหัสนักเรียน/นักศึกษา *",
    "req.email": "อีเมล",
    "req.phone": "เบอร์โทร",
    "req.purpose": "วัตถุประสงค์การขอ",
    "req.copies": "จำนวนฉบับ",
    "req.delivery": "วิธีรับเอกสาร",
    "req.pickup": "รับด้วยตนเอง",
    "req.mail": "จัดส่งทางไปรษณีย์",
    "req.address": "ที่อยู่จัดส่ง *",
    "req.s3": "3. แนบเอกสาร",
    "req.fileHint": "PDF / JPG / PNG ไม่เกิน 5 MB ต่อไฟล์ สูงสุด 5 ไฟล์",
    "req.fileBad": "ไฟล์ \"{name}\" ต้องเป็น PDF, JPG หรือ PNG และขนาดไม่เกิน 5 MB",
    "req.submit": "ส่งคำร้อง",
    "req.submitting": "กำลังส่ง…",
    "req.error": "เกิดข้อผิดพลาด",
    "req.done": "ยื่นคำร้องเรียบร้อย ✅",
    "req.yourCode": "รหัสติดตามของคุณ",
    "req.keepCode": "โปรดจดรหัสนี้ไว้ ใช้ร่วมกับรหัสนักเรียน/นักศึกษาเพื่อติดตามสถานะ",
    "req.failed": "แนบไฟล์ไม่สำเร็จ: {files} — โปรดติดต่อเจ้าหน้าที่พร้อมแจ้งรหัสติดตาม",
    "req.goTrack": "ติดตามสถานะ",

    "trk.title": "ติดตามสถานะคำร้อง",
    "trk.code": "รหัสติดตาม",
    "trk.sid": "รหัสนักเรียน/นักศึกษา",
    "trk.check": "ตรวจสอบสถานะ",
    "trk.notFound": "ไม่พบคำร้อง — กรุณาตรวจสอบรหัสติดตามและรหัสนักเรียน/นักศึกษาอีกครั้ง",
    "trk.copies": "{n} ฉบับ",
    "trk.mail": "จัดส่งไปรษณีย์",
    "trk.pickup": "รับด้วยตนเอง",
    "trk.staffMsg": "ข้อความจากเจ้าหน้าที่: {note}",
    "trk.ready": "เอกสารของคุณพร้อมแล้ว {note}",
    "trk.history": "ประวัติสถานะ",

    "adm.noStaff": "บัญชีนี้ยังไม่ได้รับสิทธิ์เจ้าหน้าที่ (ต้องเพิ่มในตาราง staff)",
    "adm.signinTitle": "เข้าสู่ระบบเจ้าหน้าที่",
    "adm.email": "อีเมล",
    "adm.password": "รหัสผ่าน",
    "adm.signin": "เข้าสู่ระบบ",
    "adm.signinFail": "เข้าสู่ระบบไม่สำเร็จ: {msg}",
    "adm.title": "คำร้องขอเอกสาร",
    "adm.signout": "ออกจากระบบ",
    "adm.all": "ทุกสถานะ",
    "adm.search": "ค้นหา: รหัสติดตาม / รหัสนักเรียน / ชื่อ",
    "adm.refresh": "รีเฟรช",
    "adm.count": "{n} รายการ",
    "adm.thCode": "รหัส",
    "adm.thApplicant": "ผู้ยื่น",
    "adm.thDoc": "เอกสาร",
    "adm.thDate": "ยื่นเมื่อ",
    "adm.thStatus": "สถานะ",
    "adm.mailTo": "จัดส่งที่: {addr}",
    "adm.pickup": "รับด้วยตนเอง",
    "adm.purpose": "วัตถุประสงค์: {text}",
    "adm.noAtt": "ไม่มีไฟล์แนบ",
    "adm.changeStatus": "เปลี่ยนสถานะ",
    "adm.msgLabel": "ข้อความถึงผู้ยื่น (แสดงในหน้าติดตาม)",
    "adm.msgPh": "เช่น รับเอกสารได้ที่งานทะเบียน ชั้น 1",
    "adm.save": "บันทึก",
    "adm.openFail": "เปิดไฟล์ไม่ได้",
    "adm.registerLink": "สมัครเป็นเจ้าหน้าที่ใหม่",
    "adm.activateTitle": "เปิดใช้งานสิทธิ์เจ้าหน้าที่",
    "adm.activateHint": "คุณล็อกอินด้วย {email} แล้ว แต่ยังไม่มีสิทธิ์เจ้าหน้าที่ กรอกรหัสลงทะเบียนที่ได้รับจากผู้ดูแลระบบ",
    "adm.activate": "เปิดใช้งาน",

    "reg.title": "สมัครเป็นเจ้าหน้าที่ทะเบียน",
    "reg.sub": "สำหรับเจ้าหน้าที่เท่านั้น ต้องมีรหัสลงทะเบียนจากผู้ดูแลระบบ",
    "reg.name": "ชื่อที่แสดง",
    "reg.pwHint": "อย่างน้อย 8 ตัวอักษร",
    "reg.code": "รหัสลงทะเบียนเจ้าหน้าที่",
    "reg.codeHint": "ขอรหัสนี้จากผู้ดูแลระบบของหน่วยงาน",
    "reg.submit": "สมัคร",
    "reg.submitting": "กำลังสมัคร…",
    "reg.pwShort": "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
    "reg.haveAccount": "มีบัญชีแล้ว? เข้าสู่ระบบ",
    "reg.checkTitle": "ตรวจสอบอีเมลของคุณ",
    "reg.checkBody": "เราส่งลิงก์ยืนยันไปที่ {email} กดลิงก์ในอีเมลก่อน แล้วเข้าสู่ระบบ ระบบจะให้กรอกรหัสลงทะเบียนเพื่อเปิดสิทธิ์เจ้าหน้าที่",
    "reg.partialTitle": "สร้างบัญชีแล้ว แต่ยังไม่ได้สิทธิ์เจ้าหน้าที่",
    "reg.partialBody": "ไปที่หน้าเจ้าหน้าที่เพื่อกรอกรหัสลงทะเบียนอีกครั้ง",
    "reg.continue": "ไปต่อ",
    "reg.err.invalid": "รหัสลงทะเบียนไม่ถูกต้อง",
    "reg.err.locked": "กรอกรหัสผิดเกินกำหนด กรุณาติดต่อผู้ดูแลระบบ",
    "reg.err.disabled": "ขณะนี้ปิดรับสมัครเจ้าหน้าที่ใหม่",

    "status.submitted": "ยื่นคำร้องแล้ว",
    "status.reviewing": "กำลังตรวจสอบ",
    "status.need_more_info": "ต้องแก้ไข/ส่งข้อมูลเพิ่ม",
    "status.approved": "อนุมัติ",
    "status.processing": "กำลังจัดทำเอกสาร",
    "status.ready": "เอกสารพร้อมรับ/จัดส่ง",
    "status.completed": "เสร็จสิ้น",
    "status.rejected": "ไม่อนุมัติ",
    "status.cancelled": "ยกเลิก",

    "history.submitted": "ยื่นคำร้องเรียบร้อย",
  },

  en: {
    "nav.brand": "Document Request Portal",
    "nav.request": "Request",
    "nav.track": "Track",
    "nav.staff": "Staff",

    "common.loading": "Loading…",
    "common.notConfigured": "Supabase is not configured",
    "common.notConfiguredBody": "Open <code>js/config.js</code> and set <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code>.",

    "home.sub": "Request official documents online — submit, attach files and track progress from any device.",
    "home.students": "For students",
    "home.btnRequest": "Request a document",
    "home.btnTrack": "Track a request",
    "home.staff": "For registrar staff",
    "home.btnStaff": "Staff sign-in",

    "req.title": "Request a document",
    "req.loadFail": "Could not load data: {msg}",
    "req.s1": "1. Choose a document",
    "req.selectType": "— Select a document type —",
    "req.info": "{desc} · Fee {fee} per copy · about {days} working days",
    "req.required": "Required attachments: {docs}",
    "req.s2": "2. Your details",
    "req.name": "Full name *",
    "req.sid": "Student ID *",
    "req.email": "Email",
    "req.phone": "Phone",
    "req.purpose": "Purpose of request",
    "req.copies": "Number of copies",
    "req.delivery": "Delivery method",
    "req.pickup": "Pick up in person",
    "req.mail": "Send by mail",
    "req.address": "Delivery address *",
    "req.s3": "3. Attach documents",
    "req.fileHint": "PDF / JPG / PNG, up to 5 MB each, maximum 5 files",
    "req.fileBad": "File \"{name}\" must be a PDF, JPG or PNG no larger than 5 MB",
    "req.submit": "Submit request",
    "req.submitting": "Submitting…",
    "req.error": "Something went wrong",
    "req.done": "Request submitted ✅",
    "req.yourCode": "Your tracking code",
    "req.keepCode": "Keep this code safe. You need it together with your student ID to track your request.",
    "req.failed": "These files could not be attached: {files} — please contact the registrar and quote your tracking code",
    "req.goTrack": "Track a request",

    "trk.title": "Track your request",
    "trk.code": "Tracking code",
    "trk.sid": "Student ID",
    "trk.check": "Check status",
    "trk.notFound": "No request found — please check your tracking code and student ID.",
    "trk.copies": "{n} copies",
    "trk.mail": "Mail",
    "trk.pickup": "Pick up",
    "trk.staffMsg": "Message from staff: {note}",
    "trk.ready": "Your document is ready. {note}",
    "trk.history": "Status history",

    "adm.noStaff": "This account does not have staff access (add it to the staff table).",
    "adm.signinTitle": "Staff sign-in",
    "adm.email": "Email",
    "adm.password": "Password",
    "adm.signin": "Sign in",
    "adm.signinFail": "Sign-in failed: {msg}",
    "adm.title": "Document requests",
    "adm.signout": "Sign out",
    "adm.all": "All statuses",
    "adm.search": "Search: tracking code / student ID / name",
    "adm.refresh": "Refresh",
    "adm.count": "{n} requests",
    "adm.thCode": "Code",
    "adm.thApplicant": "Applicant",
    "adm.thDoc": "Document",
    "adm.thDate": "Submitted",
    "adm.thStatus": "Status",
    "adm.mailTo": "Mail to: {addr}",
    "adm.pickup": "Pick up in person",
    "adm.purpose": "Purpose: {text}",
    "adm.noAtt": "No attachments",
    "adm.changeStatus": "Change status",
    "adm.msgLabel": "Message to applicant (shown on the tracking page)",
    "adm.msgPh": "e.g. Collect from the Registrar’s Office, 1st floor",
    "adm.save": "Save",
    "adm.openFail": "Could not open the file",
    "adm.registerLink": "Register as new staff",
    "adm.activateTitle": "Activate staff access",
    "adm.activateHint": "You are signed in as {email} but do not have staff access yet. Enter the registration code from your administrator.",
    "adm.activate": "Activate",

    "reg.title": "Register as registrar staff",
    "reg.sub": "For staff only. A registration code from your administrator is required.",
    "reg.name": "Display name",
    "reg.pwHint": "At least 8 characters",
    "reg.code": "Staff registration code",
    "reg.codeHint": "Ask your administrator for this code",
    "reg.submit": "Register",
    "reg.submitting": "Registering…",
    "reg.pwShort": "Password must be at least 8 characters",
    "reg.haveAccount": "Already have an account? Sign in",
    "reg.checkTitle": "Check your email",
    "reg.checkBody": "We sent a confirmation link to {email}. Click it, then sign in. You will be asked for the registration code to activate staff access.",
    "reg.partialTitle": "Account created, but not activated as staff",
    "reg.partialBody": "Go to the staff page to enter the registration code again.",
    "reg.continue": "Continue",
    "reg.err.invalid": "Invalid registration code",
    "reg.err.locked": "Too many wrong attempts. Please contact your administrator.",
    "reg.err.disabled": "Staff registration is currently closed.",

    "status.submitted": "Submitted",
    "status.reviewing": "Under review",
    "status.need_more_info": "More information needed",
    "status.approved": "Approved",
    "status.processing": "Being prepared",
    "status.ready": "Ready for pickup / dispatch",
    "status.completed": "Completed",
    "status.rejected": "Rejected",
    "status.cancelled": "Cancelled",

    "history.submitted": "Request submitted",
  },
};

/* Server messages (from database functions / Auth) that we can translate. Unknown messages are shown as-is. */
const SERVER_MESSAGES_TH = {
  "Full name and student ID are required": "กรุณากรอกชื่อ-นามสกุลและรหัสนักเรียน/นักศึกษา",
  "Document type not found": "ไม่พบประเภทเอกสาร",
  "A delivery address is required for mail delivery": "กรุณากรอกที่อยู่สำหรับจัดส่งทางไปรษณีย์",
  "Files cannot be attached to this request": "ไม่สามารถแนบไฟล์กับคำร้องนี้ได้",
  "Invalid file path": "ตำแหน่งไฟล์ไม่ถูกต้อง",
  "Invalid login credentials": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "User already registered": "อีเมลนี้ถูกใช้สมัครแล้ว ลองเข้าสู่ระบบ",
  "Email not confirmed": "ยังไม่ได้ยืนยันอีเมล กรุณากดลิงก์ในอีเมลที่ได้รับ",
  "Signups not allowed for this instance": "ระบบปิดรับสมัครผู้ใช้ใหม่",
  "Not signed in": "กรุณาเข้าสู่ระบบก่อน",
};

let lang = DEFAULT_LANG;
try {
  const saved = localStorage.getItem("lang");
  if (LANGS.some((l) => l.code === saved)) lang = saved;
} catch (_) { /* storage unavailable: use default */ }
document.documentElement.lang = lang;

export const getLang = () => lang;
export const getLocale = () => LANGS.find((l) => l.code === lang).locale;

export function setLang(code) {
  if (!LANGS.some((l) => l.code === code) || code === lang) return;
  lang = code;
  try { localStorage.setItem("lang", code); } catch (_) { /* ignore */ }
  document.documentElement.lang = code;
  document.title = t("nav.brand");
  dispatchEvent(new Event("langchange"));
}

/** Translate a key; `{name}` placeholders are replaced from `vars`. */
export function t(key, vars = {}) {
  const s = DICT[lang][key] ?? DICT.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
}

/** Translate a server/Auth error message if we know it. */
export function errText(msg) {
  return lang === "th" ? (SERVER_MESSAGES_TH[msg] ?? msg) : msg;
}

/** Pick the Thai column (e.g. name_th) when Thai is active and filled in, otherwise the base column. */
export function loc(row, field) {
  if (!row) return "";
  return (lang === "th" && row[field + "_th"]) || row[field] || "";
}
