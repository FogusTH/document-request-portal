import { app } from "../lib/utils.js";
import { t } from "../i18n.js";

export function pageHome() {
  app.innerHTML = `<div class="wrap">
    <h1>${t("nav.brand")}</h1>
    <p class="muted">${t("home.sub")}</p>
    <div class="card"><h2>${t("home.students")}</h2><div class="actions">
      <a href="#/request"><button>${t("home.btnRequest")}</button></a>
      <a href="#/track"><button class="ghost">${t("home.btnTrack")}</button></a></div></div>
    <div class="card"><h2>${t("home.staff")}</h2><a href="#/admin"><button class="ghost">${t("home.btnStaff")}</button></a></div>
  </div>`;
}
