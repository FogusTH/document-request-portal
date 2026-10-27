import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config.js";

export const configured = SUPABASE_URL.startsWith("http") && !SUPABASE_URL.includes("YOUR-");
export const sb = configured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
