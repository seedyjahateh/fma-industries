import Link from "next/link";

import { logout } from "@/app/admin/actions";

/**
 * Shared admin furniture.
 *
 * Sizing rules that apply everywhere in here, because he is on a phone with
 * cold hands and possibly bad signal:
 *   - Tap targets are at least 44px tall.
 *   - Inputs are 16px+ so iOS does not zoom on focus.
 *   - One column. No side-by-side anything below `sm`.
 */

export function AdminHeader({ title, back }: { title: string; back?: { href: string; label: string } }) {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-panel/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          {/* min-h-11 with a negative margin gives a 44px tap target without
              pushing the title down. He taps this with a thumb. */}
          {back && (
            <Link
              href={back.href}
              className="label -my-2 inline-flex min-h-11 items-center text-slate transition-colors hover:text-ink"
            >
              ← {back.label}
            </Link>
          )}
          <h1 className="font-display truncate text-xl uppercase leading-none text-ink">
            {title}
          </h1>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="label min-h-11 shrink-0 border border-rule-strong px-4 text-slate transition-colors hover:border-ink hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}

export function AdminMain({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-3xl px-5 pb-24 pt-6">{children}</main>;
}

/** A labelled block. Legend first, then one control per row. */
export function Fieldset({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border border-rule bg-panel-2 p-5">
      <legend className="label bg-panel-2 px-2 text-ink">{legend}</legend>
      {hint && <p className="mb-4 mt-1 text-sm leading-snug text-slate">{hint}</p>}
      <div className="space-y-5">{children}</div>
    </fieldset>
  );
}

const inputBase =
  "w-full border border-rule bg-panel px-3.5 py-3 text-base text-ink placeholder:text-slate focus:border-ink focus:outline-none";

export function Field({
  label,
  name,
  hint,
  defaultValue,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  hint?: string;
  defaultValue?: string | number;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="label block text-slate">{label}</span>
      {hint && <span className="mt-1 block text-xs leading-snug text-slate">{hint}</span>}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className={`mt-2 ${inputBase}`}
        {...rest}
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  hint,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  hint?: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="label block text-slate">{label}</span>
      {hint && <span className="mt-1 block text-xs leading-snug text-slate">{hint}</span>}
      <textarea name={name} rows={rows} defaultValue={defaultValue} className={`mt-2 ${inputBase}`} />
    </label>
  );
}

/** Big switch row. The whole row is the tap target, not just the box. */
export function Toggle({
  label,
  name,
  hint,
  defaultChecked,
}: {
  label: string;
  name: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3.5 border border-rule bg-panel p-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-5 w-5 shrink-0 accent-[#0e1417]"
      />
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {hint && <span className="mt-1 block text-xs leading-snug text-slate">{hint}</span>}
      </span>
    </label>
  );
}
