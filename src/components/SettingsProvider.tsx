"use client";

import { createContext, useContext } from "react";

import type { SiteSettings } from "@/lib/settings";

/**
 * Makes the owner-editable settings available to Client Components.
 *
 * Server Components should call `getSettings()` directly instead of using this.
 * The context exists only for the handful of components that must be client
 * side: the header, the sticky call bar and the intake form.
 *
 * The value is fetched once in the root layout, from a cached read, so this
 * costs no extra database work and does not make any route dynamic.
 */

const SettingsContext = createContext<SiteSettings | null>(null);

export function SettingsProvider({
  value,
  children,
}: {
  value: SiteSettings;
  children: React.ReactNode;
}) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SiteSettings {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error("useSettings must be used inside <SettingsProvider>, mounted in the root layout.");
  }
  return value;
}
