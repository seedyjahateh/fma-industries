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
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

/**
 * Runs the CLI's JS entry point under this Node, rather than the npx.cmd shim.
 *
 * Two reasons, both learned the hard way. Node refuses to spawn a .cmd without
 * `shell: true` (the CVE-2024-27980 fix) and reports it as EINVAL with a null
 * exit status, which reads as a silent failure. And `shell: true` is not an
 * option here: the connection string is an argument, cmd.exe expands % inside
 * double quotes, and a percent-encoded password is full of them. This project
 * has already lost a bcrypt hash to exactly that.
 */
function resolveCli() {
  const pkgPath = require.resolve("supabase/package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  return join(dirname(pkgPath), pkg.bin.supabase);
}

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
let parsed;
try {
  parsed = new URL(dbUrl);
} catch {
  console.error("SUPABASE_DB_URL does not parse as a URL.");
  process.exit(1);
}

/**
 * `supabase db push --db-url` documents that the string must be percent-encoded.
 * A password containing @ / : ? # or a space silently truncates the userinfo and
 * the CLI then fails against a host that is not the one you meant, so refuse
 * rather than transform: rewriting somebody's password to make it parse is a
 * worse outcome than saying what is wrong.
 */
const rawUserinfo = /^[a-z+]+:\/\/([^@]*)@/i.exec(dbUrl)?.[1] ?? "";
const rawPassword = rawUserinfo.slice(rawUserinfo.indexOf(":") + 1);
const needsEncoding = /[@/:?#[\]\s]/.test(rawPassword);
if (needsEncoding) {
  console.error(
    "The password inside SUPABASE_DB_URL contains a character that has to be\n" +
      "percent-encoded (@ / : ? # [ ] or a space). Replace it in .env.local:\n" +
      "  @ -> %40   / -> %2F   : -> %3A   ? -> %3F   # -> %23   space -> %20\n" +
      "Or reset the database password to an alphanumeric one in the dashboard."
  );
  process.exit(1);
}

console.log(`Pushing migrations to ${parsed.hostname}${parsed.pathname}\n`);

// --yes because this runs non-interactively; the CLI's confirmation prompt
// reads EOF and aborts with no output at all, which looks like a silent failure.
// Extra args pass through, so `npm run db:push -- --dry-run --debug` works.
const result = spawnSync(
  process.execPath,
  [resolveCli(), "db", "push", "--db-url", dbUrl, "--include-all", "--yes", ...process.argv.slice(2)],
  { stdio: "inherit" }
);

// Never collapse a spawn failure into a bare exit code. `status` is null when
// the process could not be started at all, and reporting that as 1 with no
// message is indistinguishable from the migration itself failing.
if (result.error) {
  console.error(`\nCould not start the Supabase CLI: ${result.error.message}`);
  process.exit(1);
}
if (result.status === null) {
  console.error(`\nThe Supabase CLI was terminated by signal ${result.signal ?? "unknown"}.`);
  process.exit(1);
}

process.exit(result.status);
