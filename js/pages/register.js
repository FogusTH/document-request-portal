import { sb } from "../lib/supabase.js";
import { app, $, esc } from "../lib/utils.js";
import { t, errText } from "../i18n.js";

export function pageRegister() {
  app.innerHTML = `<form class="wrap" id="rf"><h1>${t("reg.title")}</h1>
    <p class="muted">${t("reg.sub")}</p>
    <div class="card">
      <label>${t("reg.name")}</label><input id="dn" required autocomplete="name">
      <label>${t("adm.email")}</label><input id="em" type="email" required autocomplete="email">
      <label>${t("adm.password")}</label><input id="pw" type="password" required minlength="8" autocomplete="new-password">
      <p class="muted">${t("reg.pwHint")}</p>
      <label>${t("reg.code")}</label><input id="rc" type="password" required autocomplete="off">
      <p class="muted">${t("reg.codeHint")}</p>
      <p><button id="go">${t("reg.submit")}</button></p>
      <p class="err" id="err"></p>
      <p class="muted"><a href="#/admin">${t("reg.haveAccount")}</a></p>
    </div></form>`;

  $("#rf").onsubmit = async (e) => {
    e.preventDefault();
    const err = $("#err"), btn = $("#go");
    err.textContent = "";
    if ($("#pw").value.length < 8) { err.textContent = t("reg.pwShort"); return; }
    btn.disabled = true; btn.textContent = t("reg.submitting");

    const { data, error } = await sb.auth.signUp({
      email: $("#em").value.trim(),
      password: $("#pw").value,
      options: {
        data: { display_name: $("#dn").value.trim() },
        emailRedirectTo: location.origin + location.pathname + "#/admin",
      },
    });
    if (error) { err.textContent = errText(error.message); btn.disabled = false; btn.textContent = t("reg.submit"); return; }

    // Email confirmation is on: no session yet. The code is entered after the first sign-in.
    if (!data.session) {
      app.innerHTML = `<div class="wrap"><div class="okbox"><h2>${t("reg.checkTitle")}</h2>
        <p>${esc(t("reg.checkBody", { email: $("#em").value.trim() }))}</p>
        <a href="#/admin"><button>${t("adm.signin")}</button></a></div></div>`;
      return;
    }

    const r = await sb.rpc("register_staff", { p_code: $("#rc").value, p_name: $("#dn").value });
    if (r.error || (r.data !== "ok" && r.data !== "already")) {
      const why = r.error ? errText(r.error.message) : t("reg.err." + r.data);
      app.innerHTML = `<div class="wrap"><div class="card"><h2>${t("reg.partialTitle")}</h2>
        <p class="err">${esc(why)}</p><p class="muted">${t("reg.partialBody")}</p>
        <a href="#/admin"><button>${t("reg.continue")}</button></a></div></div>`;
      return;
    }
    location.hash = "#/admin";
  };
}
