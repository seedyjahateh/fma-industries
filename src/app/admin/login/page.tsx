import { redirect } from "next/navigation";

import { getSession, isAuthConfigured } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  // Already signed in: skip the form.
  if (await getSession()) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl uppercase leading-none text-ink">FMA</span>
          <span aria-hidden className="tape-stripes h-2.5 w-6" />
          <span className="label text-slate">Admin</span>
        </div>

        <h1 className="font-display mt-6 text-h2 uppercase text-ink">Sign in</h1>

        {!isAuthConfigured() ? (
          <div className="mt-6 border border-alarm bg-panel-2 p-5">
            <p className="text-sm font-semibold text-ink">No account is set up yet.</p>
            <p className="mt-2 text-sm leading-snug text-slate">
              Run{" "}
              <code className="font-mono text-ink">
                node scripts/hash-password.mjs &quot;a password&quot;
              </code>{" "}
              and put the three values it prints into <code className="font-mono text-ink">.env.local</code>.
            </p>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
