import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * Uses the SERVICE ROLE key, which bypasses Row Level Security. That is only
 * safe because this module is `server-only`: importing it from a Client
 * Component is a build error, not a runtime leak. Never pass this client, or
 * anything derived from it, across the server/client boundary.
 *
 * There is deliberately no browser client. Nothing in this app talks to the
 * database from the browser; every read and write goes through a Server Action
 * or a Route Handler that has already checked the session.
 */

let client: SupabaseClient | null = null;

/** Null when the project has not been provisioned yet, so callers can fall back. */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  client = createClient(url, key, {
    auth: {
      // No user sessions to persist: this process is the only "user".
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return client;
}

/** True once the database is wired up. Used to soften the admin UI before then. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
