import { PLACEHOLDERS_REMAINING } from "@/config/business";

/**
 * Development-only reminder that the site is still carrying placeholder
 * business facts. Renders nothing in a production build, so it can never
 * reach a real visitor — but it is impossible to miss while working.
 *
 * Delete this component (and its entry in layout.tsx) once every item in
 * PLACEHOLDERS_REMAINING has been filled in from the owner's answers.
 */
export function PlaceholderWarning() {
  if (process.env.NODE_ENV === "production") return null;
  if (PLACEHOLDERS_REMAINING.length === 0) return null;

  return (
    <details className="fixed bottom-24 left-4 z-[60] max-w-sm border border-ink bg-panel text-xs shadow-lg md:bottom-4">
      <summary className="cursor-pointer bg-alarm px-3 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-white">
        {PLACEHOLDERS_REMAINING.length} placeholders · dev only
      </summary>
      <ul className="max-h-64 space-y-1.5 overflow-y-auto p-3 text-slate">
        {PLACEHOLDERS_REMAINING.map((item) => (
          <li key={item} className="leading-snug">
            · {item}
          </li>
        ))}
      </ul>
      <p className="border-t border-rule p-3 text-slate-2">
        Edit <code className="font-mono text-ink">src/config/business.ts</code>
      </p>
    </details>
  );
}
