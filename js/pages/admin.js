import { sb } from "../lib/supabase.js";
import { app, $, esc, fmt, statusLabel, statusOptions } from "../lib/utils.js";
import { t, errText, loc } from "../i18n.js";

const A = { filter: "", q: "", open: null, rows: [], msg: "" };

export async function pageAdmin() {
  const { data: { user } } = await sb.auth.getUser();
  let isStaff = false;
  if (user) {
    const { data } = await sb.from("staff").select("user_id").eq("user_id", user.id).maybeSingle();
    isStaff = !!data;
  }
  if (!isStaff) return adminLogin(user ? t("adm.noStaff") : "");
  await adminLoad(); adminRender();
}

function adminLogin(msg) {
  app.innerHTML = `<form class="wrap" id="lf"><h1>${t("adm.signinTitle")}</h1><div class="card">
    <label>${t("adm.email")}</label><input id="em" type="email" required>
    <label>${t("adm.password")}</label><input id="pw" type="password" required>
    <p><button>${t("adm.signin")}</button></p><p class="err" id="err">${esc(msg)}</p></div></form>`;
  $("#lf").onsubmit = async (e) => {
    e.preventDefault();
    const { error } = await sb.auth.signInWithPassword({ email: $("#em").value, password: $("#pw").value });
    if (error) { $("#err").textContent = t("adm.signinFail", { msg: errText(error.message) }); return; }
    pageAdmin();
  };
}

async function adminLoad() {
  let q = sb.from("requests").select("*, request_types(name,name_th), attachments(id,file_path,file_name)").order("created_at", { ascending: false }).limit(200);
  if (A.filter) q = q.eq("status", A.filter);
  const { data, error } = await q;
  A.msg = error ? errText(error.message) : "";
  A.rows = data || [];
}

function adminRender() {
  const s = A.q.toLowerCase();
  const rows = A.rows.filter(r => !s || [r.tracking_code, r.student_id, r.requester_name].some(v => (v || "").toLowerCase().includes(s)));
  app.innerHTML = `<div class="wrap wide">
    <div class="actions" style="justify-content:space-between"><h1>${t("adm.title")}</h1><button class="ghost" id="out">${t("adm.signout")}</button></div>
    <div class="card actions">
      <select id="flt" style="width:220px"><option value="">${t("adm.all")}</option>${statusOptions(A.filter)}</select>
      <input id="q" style="max-width:300px" placeholder="${esc(t("adm.search"))}" value="${esc(A.q)}">
      <button class="ghost" id="rf">${t("adm.refresh")}</button><span class="muted">${esc(t("adm.count", { n: rows.length }))}</span></div>
    <p class="err">${esc(A.msg)}</p>
    <div class="card" style="padding:0;overflow-x:auto"><table>
      <thead><tr><th>${t("adm.thCode")}</th><th>${t("adm.thApplicant")}</th><th>${t("adm.thDoc")}</th><th>${t("adm.thDate")}</th><th>${t("adm.thStatus")}</th></tr></thead>
      <tbody>${rows.map(r => `
        <tr class="clickable" data-id="${r.id}">
          <td><b>${esc(r.tracking_code)}</b></td>
          <td>${esc(r.requester_name)}<div class="muted">${esc(r.student_id)}</div></td>
          <td>${esc(loc(r.request_types, "name"))} <span class="muted">× ${esc(r.copies)}</span></td>
          <td>${esc(fmt(r.created_at))}</td>
          <td><span class="badge ${esc(r.status)}">${esc(statusLabel(r.status))}</span></td></tr>
        ${A.open === r.id ? `<tr><td colspan="5" style="background:#fafbfc">
          <p class="muted">${esc(r.email || "-")} · ${esc(r.phone || "-")} · ${r.delivery_method === "mail" ? esc(t("adm.mailTo", { addr: r.address })) : t("adm.pickup")}<br>${esc(t("adm.purpose", { text: r.purpose || "-" }))}</p>
          <div class="actions">${r.attachments.length ? r.attachments.map(a => `<button class="ghost dl" data-path="${esc(a.file_path)}">📎 ${esc(a.file_name)}</button>`).join("") : `<span class="muted">${t("adm.noAtt")}</span>`}</div>
          <div class="row">
            <div><label>${t("adm.changeStatus")}</label><select id="st">${statusOptions(r.status)}</select></div>
            <div><label>${t("adm.msgLabel")}</label><input id="nt" value="${esc(r.staff_note || "")}" placeholder="${esc(t("adm.msgPh"))}"></div>
          </div>
          <p><button id="save" data-id="${r.id}">${t("adm.save")}</button></p></td></tr>` : ""}`).join("")}
      </tbody></table></div></div>`;

  $("#out").onclick = async () => { await sb.auth.signOut(); pageAdmin(); };
  $("#flt").onchange = async (e) => { A.filter = e.target.value; await adminLoad(); adminRender(); };
  $("#q").oninput = (e) => { A.q = e.target.value; const pos = e.target.selectionStart; adminRender(); const q = $("#q"); q.focus(); q.setSelectionRange(pos, pos); };
  $("#rf").onclick = async () => { await adminLoad(); adminRender(); };
  document.querySelectorAll("tr.clickable").forEach(tr => tr.onclick = () => { A.open = A.open === tr.dataset.id ? null : tr.dataset.id; adminRender(); });
  document.querySelectorAll(".dl").forEach(b => b.onclick = async () => {
    const { data, error } = await sb.storage.from("request-files").createSignedUrl(b.dataset.path, 120);
    if (error || !data) { A.msg = errText(error?.message) || t("adm.openFail"); adminRender(); return; }
    window.open(data.signedUrl, "_blank");
  });
  const save = $("#save");
  if (save) save.onclick = async () => {
    const { error } = await sb.from("requests").update({ status: $("#st").value, staff_note: $("#nt").value || null }).eq("id", save.dataset.id);
    if (error) { A.msg = errText(error.message); adminRender(); return; }
    A.open = null; await adminLoad(); adminRender();
  };
}
