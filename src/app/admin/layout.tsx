import type { Metadata } from "next";

/**
 * Admin shell.
 *
 * Deliberately does NOT reuse the marketing Header/Footer: he is not a visitor
 * and does not need the sales navigation. Everything here is sized for a phone
 * held in one hand, because that is where it will actually be used.
 */

export const metadata: Metadata = {
  title: "Admin",
  // Belt and braces alongside the robots.ts disallow.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-panel">{children}</div>;
}
