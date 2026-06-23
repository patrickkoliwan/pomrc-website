import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnvValue } from "@/lib/env";

function getSupabaseUrl() {
  const url = getEnvValue("NEXT_PUBLIC_SUPABASE_URL");

  if (!url) {
    return undefined;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? url
      : undefined;
  } catch {
    return undefined;
  }
}

export function hasSupabasePublicConfig() {
  return Boolean(
    getSupabaseUrl() && getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

export function hasSupabaseAdminConfig() {
  return Boolean(getSupabaseUrl() && getEnvValue("SUPABASE_SERVICE_ROLE_KEY"));
}

export function getSupabasePublicClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const anonKey = getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    return null;
  }

  if (!hasSupabasePublicConfig()) {
    return null;
  }

  return createClient(
    url,
    anonKey,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

export function getSupabaseAdminClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const serviceRoleKey = getEnvValue("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are not configured");
  }

  return createClient(
    url,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

export function getStorageBucketName() {
  return getEnvValue("SUPABASE_STORAGE_BUCKET") || "club-media";
}
