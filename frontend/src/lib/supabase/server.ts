import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function hasSupabasePublicConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function hasSupabaseAdminConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabasePublicClient(): SupabaseClient | null {
  if (!hasSupabasePublicConfig()) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

export function getSupabaseAdminClient(): SupabaseClient {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase admin environment variables are not configured");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

export function getStorageBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET || "club-media";
}
