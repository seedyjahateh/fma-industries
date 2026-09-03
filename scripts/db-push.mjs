/**
 * Applies supabase/migrations to the project named by SUPABASE_DB_URL.
 *
 * A wrapper rather than a raw `supabase db push` because the connection string
 * holds the database password, and it belongs in .env.local rather than in
 * shell history or a committed npm script.
 *
 *   npm run db:push
 *
 * The Supabase CLI can also do this via `supabase login` + `supabase link`, but
 * that needs an interactive browser sign-in. This path needs one value in a
 * file that is already gitignored.
 */

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

if (!existsSync(".env.local")) {
  console.error("No .env.local. Copy .env.example and fill in SUPABASE_DB_URL first.");
  process.exit(1);
}

let dbUrl = process.env.SUPABASE_DB_URL ?? "";
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = /^\s*SUPABASE_DB_URL\s*=\s*(.*)$/.exec(line);
  if (!m) continue;
  dbUrl = m[1].trim().replace(/^["']|["']$/g, "");
}

if (!dbUrl) {
  console.error("SUPABASE_DB_URL is not set in .env.local. See .env.example for where to find it.");
  process.exit(1);
}
if (dbUrl.includes("[YOUR-PASSWORD]") || dbUrl.includes(":PASSWORD@")) {
  console.error("SUPABASE_DB_URL still has the placeholder password in it.");
  process.exit(1);
}

// Show the host, never the credentials.
try {
  const u = new URL(dbUrl);
  console.log(`Pushing migrations to ${u.hostname}${u.pathname}\n`);
} catch {
  console.error("SUPABASE_DB_URL does not parse as a URL.");
  process.exit(1);
}

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["supabase", "db", "push", "--db-url", dbUrl, "--include-all"],
  { stdio: "inherit" }
);

process.exit(result.status ?? 1);
