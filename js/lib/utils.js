/* Shared constants and helpers */
import { t, getLocale } from "../i18n.js";

export const STATUS_KEYS = ["submitted", "reviewing", "need_more_info", "approved", "processing", "ready", "completed", "rejected", "cancelled"];
export const statusLabel = (k) => t("status." + k);

export const MAX_SIZE = 5 * 1024 * 1024;
export const ALLOWED = ["application/pdf", "image/jpeg", "image/png"];

export const app = document.getElementById("app");
export const $ = (s) => document.querySelector(s);
export const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const fmt = (s) => new Date(s).toLocaleString(getLocale(), { dateStyle: "medium", timeStyle: "short" });
export const statusOptions = (sel) => STATUS_KEYS.map(k => `<option value="${k}" ${k === sel ? "selected" : ""}>${esc(statusLabel(k))}</option>`).join("");
