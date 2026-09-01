import "server-only";

import { unstable_cache, revalidateTag } from "next/cache";

import { business } from "@/config/business";
import { brands as defaultBrands } from "@/config/business";
import { getSupabase } from "./supabase";

/**
 * Business facts the owner can edit himself.
 *
 * Two rules govern this file, and both matter more than they look.
 *
 * 1. THE MARKETING SITE MUST NOT DEPEND ON THE DATABASE BEING UP.
 *    src/config/business.ts is the default. The database only overrides it. If
 *    Supabase is unreachable, slow, or simply not provisioned yet, the public
 *    site renders exactly as it did before any of this existed. A contractor's
 *    phone number should not go dark because a free-tier database is asleep.
 *
 * 2. READS MUST BE CACHED OR EVERY PAGE GOES DYNAMIC.
 *    `use cache` needs `cacheComponents: true`, which the Next 16 upgrade guide
 *    warns is not a rename-only change. We are not taking that migration, so we
 *    use `unstable_cache` instead. Without it, one Supabase query inside a
 *    Server Component would turn 30 prerendered pages into per-request renders
 *    and undo the performance work.
 */

export const SETTINGS_TAG = "settings";

export interface SiteSettings {
  phoneDisplay: string;
  phoneHref: string;
  smsHref: string | null;
  email: string | null;
  hours: { weekday: string; saturday: string; sunday: string };
  openingHours: { days: string[]; opens: string; closes: string }[];
  emergency: {
    available: boolean;
    label: string;
    /** Resolved: falls back to the main line when there is no separate number. */
    display: string;
    href: string;
  };
  brands: readonly string[];
  /** False when the values came from config because the database was unavailable. */
  fromDatabase: boolean;
}

/** Shape of the single `settings` row. */
interface SettingsRow {
  hours_weekday: string;
  hours_saturday: string;
  hours_sunday: string;
  opening_hours: { days: string[]; opens: string; closes: string }[];
  emergency_available: boolean;
  emergency_label: string;
  phone_display: string;
  phone_e164: string;
  sms_enabled: boolean;
  email: string | null;
  brands: string[];
}

/** Everything the site shows when the database has nothing to say. */
export function defaultSettings(): SiteSettings {
  return {
    phoneDisplay: business.phoneDisplay,
    phoneHref: business.phoneHref,
    smsHref: business.smsHref,
    email: business.email,
    hours: { ...business.hours },
    openingHours: business.openingHours.map((h) => ({
      days: [...h.days],
      opens: h.opens,
      closes: h.closes,
    })),
    emergency: {
      available: business.emergency.available,
      label: business.emergency.label,
      display: business.emergency.phoneDisplay ?? business.phoneDisplay,
      href: business.emergency.phoneHref ?? business.phoneHref,
    },
    brands: defaultBrands,
    fromDatabase: false,
  };
}

function rowToSettings(row: SettingsRow): SiteSettings {
  const href = `tel:${row.phone_e164}`;
  return {
    phoneDisplay: row.phone_display,
    phoneHref: href,
    smsHref: row.sms_enabled ? `sms:${row.phone_e164}` : null,
    email: row.email?.trim() ? row.email.trim() : null,
    hours: {
      weekday: row.hours_weekday,
      saturday: row.hours_saturday,
      sunday: row.hours_sunday,
    },
    openingHours: Array.isArray(row.opening_hours) ? row.opening_hours : [],
    emergency: {
      available: row.emergency_available,
      label: row.emergency_label,
      // He has no separate after-hours line, so both resolve to the main number.
      display: row.phone_display,
      href,
    },
    // An empty brands array means "not filled in yet", not "services no brands".
    brands: row.brands?.length ? row.brands : defaultBrands,
    fromDatabase: true,
  };
}

const readSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("settings")
      .select(
        "hours_weekday, hours_saturday, hours_sunday, opening_hours, emergency_available, emergency_label, phone_display, phone_e164, sms_enabled, email, brands"
      )
      .eq("id", 1)
      .single();

    if (error || !data) return null;
    return rowToSettings(data as SettingsRow);
  },
  ["site-settings"],
  {
    tags: [SETTINGS_TAG],
    // Never expires on a timer. It changes when he presses Save, and only then.
    revalidate: false,
  }
);

/**
 * The settings every page should use. Never throws: a failure here degrades to
 * the config defaults rather than taking the site down.
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    return (await readSettings()) ?? defaultSettings();
  } catch (error) {
    console.error("[settings] read failed, serving config defaults:", error);
    return defaultSettings();
  }
}

/**
 * Call after any write. Next 16 requires the second `cacheLife` argument;
 * "max" gives the longest stale-while-revalidate window.
 */
export function invalidateSettings() {
  revalidateTag(SETTINGS_TAG, "max");
}
