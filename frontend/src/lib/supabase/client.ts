"use client";

import { createClient } from "@supabase/supabase-js";
import { normalizeEnvValue } from "@/lib/env";

export function getBrowserSupabaseClient() {
  const url = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}
