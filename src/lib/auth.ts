import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

/**
 * Single-operator authentication.
 *
 * Why not Supabase Auth: it is email-centric, and the owner has no email
 * address. A magic link has nowhere to go, and phone OTP means paying Twilio
 * for one login. So this is a username and password for exactly one person,
 * seeded by us. There is no signup route, and there is no password reset by
 * email, because there is no email.
 *
 * Why bcryptjs and not argon2: bcryptjs is pure JavaScript. Native modules are
 * an avoidable source of failure on Windows locally and in serverless bundles.
 * For one password with a strong cost factor, bcrypt is the right trade.
 *
 * IMPORTANT: `requireOperator()` below is the security boundary, not proxy.ts.
 * The proxy redirect exists so an unauthenticated visit lands on the login page
 * instead of a flash of admin UI. Every route and action still verifies for
 * itself.
 */

const COOKIE = "fma_session";
const ISSUER = "fma-industries";
const AUDIENCE = "fma-admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // A working day; he re-logs in tomorrow.

function secret(): Uint8Array {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short (needs 32+ characters). See .env.example."
    );
  }
  return new TextEncoder().encode(value);
}

export interface Session {
  sub: string;
  exp: number;
}

/* -------------------------------------------------------------------------
   Credentials
------------------------------------------------------------------------- */

/**
 * Verify a submitted password against the stored hash.
 *
 * Always runs a bcrypt comparison, even when no hash is configured, so a
 * misconfigured deployment does not answer noticeably faster than a wrong
 * password and leak that fact through timing.
 */
export async function verifyPassword(submitted: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;

  // A bcrypt hash is 60 characters and starts $2a$/$2b$/$2y$ followed by the
  // cost. If it does not, the value was almost certainly mangled by env
  // variable expansion: `$2b` and `$12` get substituted as undefined variables
  // and vanish. Escape every dollar as \$ in the env file. This check exists
  // because the failure is otherwise indistinguishable from a wrong password.
  if (hash && !/^\$2[aby]\$\d\d\$.{53}$/.test(hash)) {
    console.error(
      `[auth] ADMIN_PASSWORD_HASH does not look like a bcrypt hash (length ${hash.length}, ` +
        `starts "${hash.slice(0, 4)}"). Escape the dollar signs as \\$ in your env file, ` +
        `or re-run scripts/hash-password.mjs which now does it for you.`
    );
  }
  const comparand = hash || "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinva";
  const ok = await bcrypt.compare(submitted, comparand);
  return Boolean(hash) && ok;
}

/** Used by scripts/hash-password.mjs to generate the value for the env var. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

/* -------------------------------------------------------------------------
   Session
------------------------------------------------------------------------- */

export async function createSession(username: string) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    // Off over plain http so local development works; always on in production.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/** Returns the session, or null. Never throws on a bad or forged token. */
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (!payload.sub || !payload.exp) return null;
    return { sub: payload.sub, exp: payload.exp };
  } catch {
    // Expired, tampered with, or signed by a rotated secret.
    return null;
  }
}

/**
 * The actual gate. Call at the top of every admin page and every admin Server
 * Action. Redirects rather than returning null, so forgetting to handle the
 * null case cannot accidentally render admin UI.
 */
export async function requireOperator(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** True once a password has been configured, used to explain setup in the UI. */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET);
}
