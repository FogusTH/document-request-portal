import { sb } from "../lib/supabase.js";
import { app, $, esc, MAX_SIZE, ALLOWED } from "../lib/utils.js";
import { t, errText, loc } from "../i18n.js";

export async function pageRequest() {
  app.innerHTML = `<div class="wrap">${t("common.loading")}</div>`;
  const { data, error } = await sb.from("request_types").select("*").eq("active", true).order("sort_order");
  if (error) { app.innerHTML = `<div class="wrap err">${esc(t("req.loadFail", { msg: errText(error.message) }))}</div>`; return; }
  const types = data || [];
  let files = [];

  app.innerHTML = `<form class="wrap" id="f">
    <h1>${t("req.title")}</h1>
    <div class="card"><h2>${t("req.s1")}</h2>
      <select id="type" required><option value="">${t("req.selectType")}</option>
        ${types.map(ty => `<option value="${ty.id}">${esc(loc(ty, "name"))}</option>`).join("")}</select>
      <p class="muted" id="info"></p></div>
    <div class="card"><h2>${t("req.s2")}</h2>
      <div class="row">
        <div><label>${t("req.name")}</label><input id="name" required></div>
        <div><label>${t("req.sid")}</label><input id="sid" required></div>
        <div><label>${t("req.email")}</label><input id="email" type="email"></div>
        <div><label>${t("req.phone")}</label><input id="phone"></div>
      </div>
      <label>${t("req.purpose")}</label><textarea id="purpose"></textarea>
      <div class="row">
        <div><label>${t("req.copies")}</label><input id="copies" type="number" min="1" max="20" value="1"></div>
        <div><label>${t("req.delivery")}</label><select id="delivery"><option value="pickup">${t("req.pickup")}</option><option value="mail">${t("req.mail")}</option></select></div>
      </div>
      <div id="addrBox" style="display:none"><label>${t("req.address")}</label><textarea id="address"></textarea></div>
    </div>
    <div class="card"><h2>${t("req.s3")}</h2>
      <input id="files" type="file" multiple accept=".pdf,.jpg,.jpeg,.png">
      <p class="muted">${t("req.fileHint")}</p></div>
    <p class="err" id="err"></p>
    <button id="submit">${t("req.submit")}</button>
  </form>`;

  $("#type").onchange = () => {
    const ty = types.find(x => x.id === $("#type").value);
    $("#info").innerHTML = ty
      ? esc(t("req.info", { desc: loc(ty, "description"), fee: ty.fee, days: ty.processing_days }))
        + (loc(ty, "required_documents") ? `<br>${esc(t("req.required", { docs: loc(ty, "required_documents") }))}` : "")
      : "";
  };
  $("#delivery").onchange = () => {
    const mail = $("#delivery").value === "mail";
    $("#addrBox").style.display = mail ? "" : "none";
    $("#address").required = mail;
  };
  $("#files").onchange = (e) => {
    const arr = Array.from(e.target.files);
    const bad = arr.find(f => !ALLOWED.includes(f.type) || f.size > MAX_SIZE);
    if (bad) { $("#err").textContent = t("req.fileBad", { name: bad.name }); e.target.value = ""; files = []; return; }
    $("#err").textContent = ""; files = arr.slice(0, 5);
  };

  $("#f").onsubmit = async (e) => {
    e.preventDefault();
    $("#err").textContent = ""; $("#submit").disabled = true; $("#submit").textContent = t("req.submitting");
    try {
      const { data: code, error } = await sb.rpc("submit_request", {
        p_request_type_id: $("#type").value, p_requester_name: $("#name").value, p_student_id: $("#sid").value,
        p_email: $("#email").value, p_phone: $("#phone").value, p_purpose: $("#purpose").value,
        p_copies: Number($("#copies").value), p_delivery_method: $("#delivery").value, p_address: $("#address").value
      });
      if (error) throw new Error(errText(error.message));

      const failed = [];
      for (const f of files) {
        const path = `${code}/${Date.now()}-${f.name.replace(/[^\w.\-]+/g, "_")}`;
        const up = await sb.storage.from("request-files").upload(path, f, { contentType: f.type });
        if (up.error) { failed.push(f.name); continue; }
        const att = await sb.rpc("add_attachment", { p_tracking_code: code, p_file_path: path, p_file_name: f.name, p_file_type: f.type, p_file_size: f.size });
        if (att.error) failed.push(f.name);
      }
      app.innerHTML = `<div class="wrap"><div class="okbox"><h2>${t("req.done")}</h2>
        <p>${t("req.yourCode")}</p><div class="code">${esc(code)}</div>
        <p class="muted">${t("req.keepCode")}</p>
        ${failed.length ? `<p class="err">${esc(t("req.failed", { files: failed.join(", ") }))}</p>` : ""}
        <a href="#/track?code=${encodeURIComponent(code)}"><button>${t("req.goTrack")}</button></a></div></div>`;
    } catch (err) {
      $("#err").textContent = err.message || t("req.error");
      $("#submit").disabled = false; $("#submit").textContent = t("req.submit");
    }
  };
}
