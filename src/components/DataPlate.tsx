import { business } from "@/config/business";
import { getSettings } from "@/lib/settings";
import { services } from "@/config/services";
import { counties } from "@/config/areas";

/**
 * The hero's centrepiece: the business stated as an equipment data plate.
 *
 * Every commercial unit this company touches carries one of these, riveted to
 * the panel and stamped with the specs that matter. Presenting the business the
 * same way is both the most characteristic object in the trade and genuinely
 * the fastest way to answer "can you do my job".
 *
 * Carries `on-dark` because it is a dark card sitting inside the light hero.
 * Its ancestors are light, so it has to opt into the dark token set itself.
 */

function Rivet({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-1.5 w-1.5 rounded-full bg-panel/25 ring-1 ring-inset ring-panel/10 ${className}`}
    />
  );
}

export async function DataPlate() {
  const settings = await getSettings();
  const rows: [string, string][] = [
    ["Trades in-house", String(services.length).padStart(2, "0")],
    ["Years in trade", `${business.yearsExperience}+`],
    ["Counties served", String(counties.length).padStart(2, "0")],
    ["Emergency", settings.emergency.available ? "24 / 7" : "By appt."],
    ["Base", `${business.address.city}, ${business.address.state}`],
  ];

  return (
    <div className="on-dark relative bg-ink text-panel shadow-[0_24px_60px_-24px_rgba(14,20,23,0.45)]">
      <Rivet className="left-2.5 top-2.5" />
      <Rivet className="right-2.5 top-2.5" />
      <Rivet className="bottom-2.5 left-2.5" />
      <Rivet className="bottom-2.5 right-2.5" />

      {/* Stamped header */}
      <div className="flex items-center justify-between gap-4 border-b border-rule-dark px-7 py-4">
        <p className="label text-panel">{business.name}</p>
        <span aria-hidden className="tape-stripes h-3 w-14" />
      </div>

      <dl className="px-7 py-2">
        {rows.map(([k, v], i) => (
          <div
            key={k}
            className={`flex items-baseline justify-between gap-6 py-3.5 ${
              i < rows.length - 1 ? "border-b border-rule-dark" : ""
            }`}
          >
            <dt className="label text-slate">{k}</dt>
            <dd className="font-display tabular text-lg uppercase leading-none text-panel">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-rule-dark px-7 py-4">
        <p className="label text-slate">
          HVAC · Refrigeration · Kitchen · Plumbing · Electrical · Appliances
        </p>
      </div>
    </div>
  );
}
