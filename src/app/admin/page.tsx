import Link from "next/link";

import { requireOperator } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { isDatabaseConfigured } from "@/lib/supabase";
import { AdminHeader, AdminMain } from "@/components/admin/AdminChrome";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminHome() {
  await requireOperator();

  const settings = await getSettings();
  const dbReady = isDatabaseConfigured();

  return (
    <>
      <AdminHeader title="Your business" />

      <AdminMain>
        {!dbReady && (
          <div className="mb-6 border border-alarm bg-panel-2 p-5">
            <p className="text-sm font-semibold text-ink">The database is not connected yet.</p>
            <p className="mt-2 text-sm leading-snug text-slate">
              The website is running fine on its built-in defaults, but nothing you change here
              will save until <code className="font-mono text-ink">SUPABASE_URL</code> and{" "}
              <code className="font-mono text-ink">SUPABASE_SERVICE_ROLE_KEY</code> are set.
            </p>
          </div>
        )}

        <nav className="border-y border-rule">
          <Link
            href="/admin/settings"
            className="flex min-h-16 items-center justify-between gap-4 border-b border-rule py-4 transition-colors hover:bg-panel-2"
          >
            <span>
              <span className="font-display-tight block text-base uppercase text-ink">
                Hours &amp; contact
              </span>
              <span className="mt-1 block text-sm text-slate">
                Opening times, phone, emergency cover, brands
              </span>
            </span>
            <span aria-hidden className="text-slate">
              →
            </span>
          </Link>
        </nav>

        {/* What the site is telling customers right now, so he can sanity-check
            it without leaving the panel. */}
        <section className="mt-8">
          <h2 className="label text-slate">Live on the website now</h2>
          <dl className="mt-4 border-t border-rule">
            {[
              ["Monday to Friday", settings.hours.weekday],
              ["Saturday", settings.hours.saturday],
              ["Sunday", settings.hours.sunday],
              ["Phone", settings.phoneDisplay],
              ["Text messages", settings.smsHref ? "On" : "Off"],
              ["Emergency cover", settings.emergency.available ? settings.emergency.label : "Not advertised"],
              ["Email", settings.email ?? "Not set up yet"],
              ["Brands listed", String(settings.brands.length)],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-6 border-b border-rule py-3.5"
              >
                <dt className="label text-slate">{k}</dt>
                <dd className="text-right text-sm font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 text-xs leading-snug text-slate">
            {settings.fromDatabase
              ? "These are your saved settings."
              : "These are the built-in defaults. Nothing has been saved yet."}
          </p>
        </section>
      </AdminMain>
    </>
  );
}
