/**
 * Built on native <details>/<summary>: keyboard accessible, findable by
 * in-page search, and functional without JavaScript. Pair with faqSchema() so
 * the same content feeds FAQPage structured data.
 */
export function FAQ({
  faqs,
  tone = "dark",
}: {
  faqs: { q: string; a: string }[];
  tone?: "dark" | "light";
}) {
  const rule = tone === "light" ? "border-rule-dark" : "border-rule";
  const q = tone === "light" ? "text-panel" : "text-ink";
  const a = tone === "light" ? "text-slate-2" : "text-slate";

  return (
    <div className={`border-t ${rule}`}>
      {faqs.map((faq) => (
        <details key={faq.q} className={`group border-b ${rule}`}>
          <summary
            className={`font-display-tight flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-base uppercase ${q} transition-colors hover:text-cold [&::-webkit-details-marker]:hidden`}
          >
            {faq.q}
            <span aria-hidden className="relative mt-1.5 h-2.5 w-2.5 shrink-0">
              <span className="absolute left-0 top-1/2 block h-px w-2.5 -translate-y-1/2 bg-current" />
              <span className="absolute left-1/2 top-0 block h-2.5 w-px -translate-x-1/2 bg-current transition-transform duration-200 group-open:scale-y-0" />
            </span>
          </summary>
          <p className={`max-w-2xl pb-6 text-sm leading-relaxed ${a}`}>{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
