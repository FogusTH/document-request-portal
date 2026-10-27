import { configured } from "./lib/supabase.js";
import { app, $ } from "./lib/utils.js";
import { t, getLang, setLang, LANGS } from "./i18n.js";
import { pageHome } from "./pages/home.js";
import { pageRequest } from "./pages/request.js";
import { pageTrack } from "./pages/track.js";
import { pageAdmin } from "./pages/admin.js";

const routes = { request: pageRequest, track: pageTrack, admin: pageAdmin };

function renderNav() {
  $("#nav").innerHTML = `
    <b>📄 ${t("nav.brand")}</b>
    <a href="#/request">${t("nav.request")}</a><a href="#/track">${t("nav.track")}</a><a href="#/admin">${t("nav.staff")}</a>
    <span class="lang">${LANGS.map(l => `<button type="button" class="ghost ${l.code === getLang() ? "on" : ""}" data-lang="${l.code}">${l.label}</button>`).join("")}</span>`;
  document.querySelectorAll("#nav [data-lang]").forEach(b => b.onclick = () => setLang(b.dataset.lang));
  document.title = t("nav.brand");
}

function route() {
  if (!configured) {
    app.innerHTML = `<div class="wrap"><div class="card"><h2>${t("common.notConfigured")}</h2>
      <p>${t("common.notConfiguredBody")}</p></div></div>`;
    return;
  }
  const [path, query] = location.hash.replace(/^#\/?/, "").split("?");
  (routes[path] || pageHome)(new URLSearchParams(query || ""));
}

addEventListener("hashchange", route);
addEventListener("langchange", () => { renderNav(); route(); });
renderNav();
route();
