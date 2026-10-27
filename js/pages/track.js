import { sb } from "../lib/supabase.js";
import { app, $, esc, fmt, statusLabel } from "../lib/utils.js";
import { t, errText, loc, getLang } from "../i18n.js";

export function pageTrack(params) {
  app.innerHTML = `<div class="wrap"><h1>${t("trk.title")}</h1>
    <form class="card" id="tf">
      <label>${t("trk.code")}</label><input id="code" required placeholder="DR-XXXXXXXX" value="${esc(params.get("code") || "")}">
      <label>${t("trk.sid")}</label><input id="sid" required>
      <p><button id="go">${t("trk.check")}</button></p><p class="err" id="err"></p>
    </form><div id="out"></div></div>`;

  $("#tf").onsubmit = async (e) => {
    e.preventDefault(); $("#err").textContent = ""; $("#out").innerHTML = ""; $("#go").disabled = true;
    const { data, error } = await sb.rpc("track_request", { p_tracking_code: $("#code").value, p_student_id: $("#sid").value });
    $("#go").disabled = false;
    if (error) { $("#err").textContent = errText(error.message); return; }
    if (!data) { $("#err").textContent = t("trk.notFound"); return; }
    const r = data;
    const typeName = getLang() === "th" && r.type_name_th ? r.type_name_th : r.type_name;
    // The default history note is written by the database in English; show it in the active language.
    const note = (h) => (h.note === "Request submitted" ? t("history.submitted") : h.note);
    $("#out").innerHTML = `<div class="card">
      <h2>${esc(typeName)} <span class="badge ${esc(r.status)}">${esc(statusLabel(r.status))}</span></h2>
      <p class="muted">${esc(r.tracking_code)} · ${esc(r.requester_name)} · ${esc(t("trk.copies", { n: r.copies }))} · ${r.delivery_method === "mail" ? t("trk.mail") : t("trk.pickup")}</p>
      ${r.status === "need_more_info" && r.staff_note ? `<p class="err">${esc(t("trk.staffMsg", { note: r.staff_note }))}</p>` : ""}
      ${r.status === "ready" ? `<p class="okbox">${esc(t("trk.ready", { note: r.staff_note || "" }))}</p>` : ""}
      <h2 style="margin-top:20px">${t("trk.history")}</h2>
      <ul class="timeline">${r.history.map(h => `<li><b>${esc(statusLabel(h.status))}</b> <span class="muted">· ${esc(fmt(h.changed_at))}</span>${note(h) ? `<div class="muted">${esc(note(h))}</div>` : ""}</li>`).join("")}</ul>
    </div>`;
  };
}
