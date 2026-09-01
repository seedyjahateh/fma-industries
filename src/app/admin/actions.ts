"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getSupabase } from "@/lib/supabase";
import { invalidateSettings } from "@/lib/settings";
import {
  createSession,
  destroySession,
  requireOperator,
  verifyPassword,
} from "@/lib/auth";

/**
 * Admin Server Actions.
 *
 * Next verifies the Origin header on Server Actions, which covers CSRF for the
 * mutations below. What it does not cover is authorisation, so every action
 * that touches data calls requireOperator() first. Never rely on the action
 * being unreachable from the UI.
 */

export interface ActionState {
  error?: string;
  ok?: string;
}

/* -------------------------------------------------------------------------
   Login
------------------------------------------------------------------------- */

/**
 * Login throttle. In-memory, so it resets on cold start and does not coordinate
 * across serverless instances. That is a real limitation, but the account is a
 * single strong password rather than an enumerable user list, and this exists to
 * blunt casual guessing rather than to be an authorisation boundary.
 */
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function throttled(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

const LoginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = LoginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { error: "Enter your username and password." };

  const { username, password } = parsed.data;

  if (throttled(username.toLowerCase())) {
    return { error: "Too many attempts. Wait ten minutes and try again." };
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  if (!expectedUser || !process.env.ADMIN_PASSWORD_HASH) {
    return { error: "No account is set up yet. Run scripts/hash-password.mjs." };
  }

  // Check the password regardless of whether the username matched, so a wrong
  // username is not distinguishable from a wrong password by response time.
  const passwordOk = await verifyPassword(password);
  const userOk = username.toLowerCase() === expectedUser.toLowerCase();

  if (!userOk || !passwordOk) {
    return { error: "That username and password do not match." };
  }

  attempts.delete(username.toLowerCase());
  await createSession(username.toLowerCase());
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* -------------------------------------------------------------------------
   Settings
------------------------------------------------------------------------- */

/** "7:00 AM – 6:00 PM" style free text, or a note like "Closed". */
const hoursText = z.string().trim().min(1).max(60);

const SettingsSchema = z.object({
  hours_weekday: hoursText,
  hours_saturday: hoursText,
  hours_sunday: hoursText,
  emergency_available: z.boolean(),
  emergency_label: z.string().trim().min(1).max(60),
  phone_display: z.string().trim().min(7).max(30),
  phone_e164: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/, "Use international format, for example +19804537227."),
  sms_enabled: z.boolean(),
  email: z.union([z.email(), z.literal("")]).transform((v) => (v === "" ? null : v)),
  brands: z
    .string()
    .transform((v) =>
      v
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  // Weekday open/close drive schema.org. Saturday is handled the same way.
  weekday_opens: z.string().regex(/^\d{2}:\d{2}$/),
  weekday_closes: z.string().regex(/^\d{2}:\d{2}$/),
  saturday_opens: z.string().regex(/^\d{2}:\d{2}$/),
  saturday_closes: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function saveSettings(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireOperator();

  const parsed = SettingsSchema.safeParse({
    hours_weekday: formData.get("hours_weekday"),
    hours_saturday: formData.get("hours_saturday"),
    hours_sunday: formData.get("hours_sunday"),
    emergency_available: formData.get("emergency_available") === "on",
    emergency_label: formData.get("emergency_label"),
    phone_display: formData.get("phone_display"),
    phone_e164: formData.get("phone_e164"),
    sms_enabled: formData.get("sms_enabled") === "on",
    email: (formData.get("email") ?? "").toString().trim(),
    brands: (formData.get("brands") ?? "").toString(),
    weekday_opens: formData.get("weekday_opens"),
    weekday_closes: formData.get("weekday_closes"),
    saturday_opens: formData.get("saturday_opens"),
    saturday_closes: formData.get("saturday_closes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Some of those values look wrong." };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return { error: "The database is not connected yet. Add SUPABASE_URL and the service role key." };
  }

  const v = parsed.data;

  const { error } = await supabase
    .from("settings")
    .update({
      hours_weekday: v.hours_weekday,
      hours_saturday: v.hours_saturday,
      hours_sunday: v.hours_sunday,
      opening_hours: [
        {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: v.weekday_opens,
          closes: v.weekday_closes,
        },
        { days: ["Saturday"], opens: v.saturday_opens, closes: v.saturday_closes },
      ],
      emergency_available: v.emergency_available,
      emergency_label: v.emergency_label,
      phone_display: v.phone_display,
      phone_e164: v.phone_e164,
      sms_enabled: v.sms_enabled,
      email: v.email,
      brands: v.brands,
    })
    .eq("id", 1);

  if (error) {
    console.error("[settings] save failed:", error);
    return { error: "Could not save. Try again in a moment." };
  }

  // Rebuilds the public pages with the new values. Without this they would keep
  // serving the previously cached HTML.
  invalidateSettings();

  return { ok: "Saved. The website is updated." };
}
