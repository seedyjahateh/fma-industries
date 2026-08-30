/**
 * Drawing-sheet backdrop.
 *
 * A hairline column grid, corner registration marks, and a fine grain, the way
 * a mechanical drawing sheet is ruled. Deliberately quiet: the boldness on this
 * page is spent on the display type and the yellow, not the background.
 */
export function HeroBackdrop({ tone = "light" }: { tone?: "light" | "dark" }) {
  const rule = tone === "dark" ? "border-rule-dark" : "border-rule";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 ${tone === "dark" ? "sheet-grid-dark" : "sheet-grid"} opacity-70`}
      />

      {/* Registration marks, as on a drawing sheet */}
      <span className={`absolute left-5 top-24 h-8 w-8 border-l border-t ${rule} md:left-10`} />
      <span className={`absolute right-5 top-24 h-8 w-8 border-r border-t ${rule} md:right-10`} />
      <span className={`absolute bottom-8 left-5 h-8 w-8 border-b border-l ${rule} md:left-10`} />
      <span className={`absolute bottom-8 right-5 h-8 w-8 border-b border-r ${rule} md:right-10`} />
    </div>
  );
}
