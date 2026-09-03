/**
 * Verifies the database and storage layer against a REAL Supabase stack.
 *
 * This exists because plan items 5 and 6 cannot be checked by reading code:
 *   5. a submission lands as rows AND objects, and the bucket is not public
 *   6. deleting a request removes the row, the photo rows, AND the objects
 *
 * It deliberately imports src/lib/jobRequests.ts rather than reimplementing the
 * queries, because the thing under test is that module's ordering guarantee.
 * A reimplementation would prove only that this script is self-consistent.
 *
 *   npm run verify:db
 *
 * Run it through that script, not bare `tsx`. The module under test imports
 * `server-only`, whose export map throws for every condition except
 * `react-server`, so plain Node dies on the import. The npm script passes
 * --conditions=react-server, which is the same condition Next sets for Server
 * Components. Running it any other way is what that error means.
 *
 * It creates and deletes its own rows, so it refuses to touch anything that is
 * not a local stack unless ALLOW_REMOTE_VERIFY=1 is set explicitly.
 */

import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

/* --- env ---------------------------------------------------------------- */

function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}
loadEnvLocal();

/**
 * Returns a string, not `string | undefined`. A plain `if (!x) process.exit()`
 * guard narrows at module scope but the narrowing is lost inside main(), which
 * is hoisted above it.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`${name} must be set. Nothing to verify.`);
    process.exit(1);
  }
  return value;
}

const URL_ = requireEnv("SUPABASE_URL");
const SERVICE = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const ANON = process.env.SUPABASE_ANON_KEY;

const isLocal = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?/.test(URL_);
if (!isLocal && process.env.ALLOW_REMOTE_VERIFY !== "1") {
  console.error(
    `Refusing to run against a non-local database.\n` +
      `  SUPABASE_URL = ${URL_}\n` +
      `This script inserts and deletes rows. Set ALLOW_REMOTE_VERIFY=1 if that is really what you want.`
  );
  process.exit(1);
}

/* --- assertions --------------------------------------------------------- */

let failures = 0;
let checks = 0;

function check(label: string, ok: boolean, detail = "") {
  checks++;
  if (ok) {
    console.log(`  PASS  ${label}${detail ? `  (${detail})` : ""}`);
  } else {
    failures++;
    console.log(`  FAIL  ${label}${detail ? `  (${detail})` : ""}`);
  }
}

function section(title: string) {
  console.log(`\n${title}`);
}

/**
 * A constraint check must assert the SPECIFIC Postgres error, never merely that
 * "an error happened". `TypeError: fetch failed` is an error too, so a laxer
 * assertion reports a constraint as enforced by a database it never reached.
 *
 *   23505 unique / primary key violation
 *   23514 check constraint violation
 *   42501 insufficient privilege
 */
function pgCode(error: { code?: string } | null): string {
  return error?.code ?? "no pg code (did the request even reach the database?)";
}

/* --- fixtures ----------------------------------------------------------- */

/** Smallest valid PNG, so Storage has real bytes with a real content type. */
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

const admin = createClient(URL_, SERVICE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { PHOTO_BUCKET, createJobRequest, attachPhoto, recordEmailResult, getJobRequest, listJobRequests, countPreviousFrom, signPhotoUrls, deleteJobRequest } =
    await import("../src/lib/jobRequests.js");

  const phone = `+1555${Date.now().toString().slice(-7)}`;

  /* -- schema is actually there -- */
  section("Schema");
  for (const table of ["settings", "job_requests", "job_request_photos"]) {
    const { error } = await admin.from(table).select("*", { head: true, count: "exact" });
    check(`table public.${table} exists`, !error, error?.message ?? "");
  }

  // Everything below assumes a reachable database with the migrations applied.
  // Continuing past this point produces pages of misleading output.
  if (failures > 0) {
    console.error(
      `\nThe database is unreachable, or the migrations have not been applied.\n` +
        `Run \`npm run db:push\` first. Stopping rather than reporting on a database that is not there.`
    );
    process.exit(1);
  }

  {
    const { data } = await admin.from("settings").select("id");
    check("settings singleton seeded with exactly one row", (data ?? []).length === 1);
  }
  {
    const { error } = await admin.from("settings").insert({ phone_display: "x" });
    // Either constraint is a legitimate rejection: the seed row was written with
    // `overriding system value`, so the identity sequence may still hand out 1.
    check(
      "a second settings row is rejected",
      error?.code === "23505" || error?.code === "23514",
      pgCode(error)
    );
  }
  {
    const { error } = await admin
      .from("job_requests")
      .insert({ name: "n", phone: "p", address: "a", city: "c", status: "banana" });
    check("invalid status is rejected by the check constraint", error?.code === "23514", pgCode(error));
  }

  /* -- item 5: a submission becomes rows and objects -- */
  section("Item 5 — a submission lands as rows and objects");

  const created = await createJobRequest({
    property_type: "Business",
    service: "Commercial Refrigeration",
    service_slug: "commercial-refrigeration",
    urgency: "emergency",
    urgency_label: "Emergency, down right now",
    name: "Verification Fixture",
    company: "Test Diner",
    phone,
    email: "",
    address: "1 Test Street",
    city: "Landis",
    contact_window: "",
    symptoms: "Not holding temperature",
    description: "Created by scripts/verify-db.ts",
    equipment_make: "True",
    equipment_model: "T-49",
    equipment_serial: "",
    access_notes: "",
  });
  check("createJobRequest returned an id", Boolean(created?.id), created?.id ?? "null");
  if (!created) throw new Error("cannot continue without a request row");

  const id = created.id;

  const attached = [await attachPhoto(id, { buffer: PNG, extension: ".png", contentType: "image/png" }), await attachPhoto(id, { buffer: PNG, extension: ".png", contentType: "image/png" })];
  check("both photos attached", attached.every(Boolean), attached.join(","));

  const detail = await getJobRequest(id);
  check("getJobRequest returns the record", Boolean(detail));
  check("record has 2 photo rows", (detail?.job_request_photos ?? []).length === 2, String((detail?.job_request_photos ?? []).length));
  check("status defaults to 'new'", detail?.status === "new", String(detail?.status));
  check("empty email became NULL", detail?.email === null, JSON.stringify(detail?.email));
  check("empty contact_window became NULL", detail?.contact_window === null, JSON.stringify(detail?.contact_window));

  const paths = (detail?.job_request_photos ?? []).map((p) => p.storage_path);
  const { data: objects } = await admin.storage.from(PHOTO_BUCKET).list(id);
  check("2 objects present in the bucket", (objects ?? []).length === 2, `${(objects ?? []).length} object(s) under ${id}/`);

  /* -- the bucket must not be publicly readable -- */
  section("Item 5 — the bucket is private");
  {
    const { data: bucket } = await admin.storage.getBucket(PHOTO_BUCKET);
    check("bucket is marked private", bucket?.public === false, `public=${bucket?.public}`);
  }
  {
    const unsigned = `${URL_}/storage/v1/object/public/${PHOTO_BUCKET}/${paths[0]}`;
    const res = await fetch(unsigned);
    check("unsigned public URL does NOT return the object", res.status !== 200, `HTTP ${res.status}`);
  }
  {
    const signed = await signPhotoUrls(paths);
    check("signPhotoUrls returned a URL for each path", signed.size === paths.length, `${signed.size}/${paths.length}`);
    const url = signed.get(paths[0]);
    if (url) {
      const res = await fetch(url);
      const body = Buffer.from(await res.arrayBuffer());
      check("signed URL returns the object", res.status === 200, `HTTP ${res.status}`);
      check("signed URL returns the same bytes that went in", body.equals(PNG), `${body.length} bytes`);
    } else {
      check("signed URL returns the object", false, "no signed url");
    }
  }

  /* -- RLS posture: the anon key must read nothing -- */
  section("RLS — a leaked anon key reads nothing");
  if (!ANON) {
    console.log("  SKIP  SUPABASE_ANON_KEY not set");
  } else {
    const anonClient = createClient(URL_, ANON, { auth: { persistSession: false } });
    // Every one of these tables has rows by now, so "zero rows and no error" is
    // real evidence that RLS hid them rather than an artefact of an empty table.
    // A transport error is NOT a pass: it would prove only that nothing was asked.
    for (const table of ["job_requests", "job_request_photos", "settings"]) {
      const { data, error } = await anonClient.from(table).select("*");
      const denied = error?.code === "42501";
      const allowedButEmpty = !error && (data ?? []).length === 0;
      check(
        `anon reads no rows from ${table}`,
        denied || allowedButEmpty,
        denied ? "42501 permission denied" : error ? pgCode(error) : `${(data ?? []).length} rows visible`
      );
    }
    const { data: anonObj } = await anonClient.storage.from(PHOTO_BUCKET).list(id);
    check("anon lists no objects in the bucket", (anonObj ?? []).length === 0, `${(anonObj ?? []).length}`);
  }

  /* -- delivery state and repeat-caller count -- */
  section("Delivery state and repeat callers");
  await recordEmailResult(id, { ok: false, error: "403 domain not verified" });
  const afterFail = await getJobRequest(id);
  check("email_error recorded", afterFail?.email_error === "403 domain not verified", String(afterFail?.email_error));
  check("emailed_at stays null on failure", afterFail?.emailed_at === null, String(afterFail?.emailed_at));

  await recordEmailResult(id, { ok: true });
  const afterOk = await getJobRequest(id);
  check("emailed_at set on success", Boolean(afterOk?.emailed_at));
  check("email_error cleared on success", afterOk?.email_error === null);

  const second = await createJobRequest({
    property_type: "Business", service: "Commercial Refrigeration", service_slug: "commercial-refrigeration",
    urgency: "soon", urgency_label: "Within a few days", name: "Verification Fixture", company: "",
    phone, email: "", address: "1 Test Street", city: "Landis", contact_window: "", symptoms: "",
    description: "second call from the same number", equipment_make: "", equipment_model: "",
    equipment_serial: "", access_notes: "",
  });
  check("repeat caller counted by phone", (await countPreviousFrom(phone, id)) === 1, `excluding self`);

  const list = await listJobRequests();
  check("listJobRequests returns both fixtures", (list ?? []).filter((r) => r.phone === phone).length === 2);
  check("list is newest first", (() => {
    const rows = list ?? [];
    for (let i = 1; i < rows.length; i++) if (rows[i - 1].created_at < rows[i].created_at) return false;
    return true;
  })());

  /* -- item 6: delete removes rows AND objects -- */
  section("Item 6 — delete removes the row, the photo rows and the objects");

  const del = await deleteJobRequest(id);
  check("deleteJobRequest reported success", del.ok, del.error ?? "");

  {
    const { data } = await admin.from("job_requests").select("id").eq("id", id);
    check("request row is gone", (data ?? []).length === 0);
  }
  {
    const { data } = await admin.from("job_request_photos").select("id").eq("request_id", id);
    check("photo rows are gone", (data ?? []).length === 0);
  }
  {
    const { data } = await admin.storage.from(PHOTO_BUCKET).list(id);
    check("storage objects are gone", (data ?? []).length === 0, `${(data ?? []).length} left behind`);
  }
  {
    // The one that would silently pass if delete order were wrong.
    const signed = await signPhotoUrls(paths);
    let reachable = 0;
    for (const url of signed.values()) {
      const res = await fetch(url);
      if (res.status === 200) reachable++;
    }
    check("deleted objects are unreachable even by a fresh signed URL", reachable === 0, `${reachable} still readable`);
  }

  /* -- cleanup the second fixture -- */
  if (second) await deleteJobRequest(second.id);
  {
    const { data } = await admin.from("job_requests").select("id").eq("phone", phone);
    check("no fixture rows left behind", (data ?? []).length === 0, `${(data ?? []).length} remaining`);
  }

  console.log(`\n${checks} checks, ${failures} failure(s).`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("\nverify-db threw:", error);
  process.exit(1);
});
