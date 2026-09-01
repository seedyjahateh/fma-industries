"use client";

import { useActionState } from "react";

import { login, type ActionState } from "@/app/admin/actions";

const input =
  "mt-2 w-full border border-rule bg-panel px-3.5 py-3 text-base text-ink focus:border-ink focus:outline-none";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(login, {});

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <label className="block">
        <span className="label block text-slate">Username</span>
        <input
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          required
          className={input}
        />
      </label>

      <label className="block">
        <span className="label block text-slate">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={input}
        />
      </label>

      {state.error && (
        <p className="border border-alarm bg-panel-2 p-3.5 text-sm text-ink" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-12 w-full bg-tape px-6 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-tape disabled:bg-panel-3 disabled:text-slate"
      >
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
