import type { Metadata } from "next";
import Link from "next/link";

import { business } from "@/config/business";
import { areas, additionalTowns, counties } from "@/config/areas";
import { Reveal } from "@/components/Reveal";
import { Container, Section, SectionHeading, ArrowIcon } from "@/components/primitives";
import { PageHero, CapabilityRail, CTABand } from "@/components/sections";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "HVAC, commercial refrigeration, plumbing, electrical and appliance service across Landis, China Grove, Kannapolis, Concord, Salisbury, Mooresville, Statesville and Harrisburg, NC.",
  alternates: { canonical: "/service-areas" },
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        label="Coverage"
        title="Based in Landis. On the road daily."
        lead={`${counties.slice(0, -1).join(", ")} and ${counties.at(-1)}. Roughly a 30 mile radius. If you are near the edge of it, call and ask.`}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Service Areas", href: "/service-areas" },
        ]}
      />

      <CapabilityRail />

      <Section tone="panel">
        <Container>
          <SectionHeading
            label="Primary areas"
            title="Cities we serve"
            lead="Each has its own page covering what we actually do there."
          />

          <div className="mt-12 grid gap-px border-y border-rule bg-rule md:grid-cols-2">
            {areas.map((area, i) => (
              <Reveal key={area.slug} delay={i * 45}>
                <Link
                  href={`/service-areas/${area.slug}`}
                  className="on-dark-hover group flex h-full flex-col justify-between gap-6 bg-panel p-7 transition-colors hover:bg-ink lg:p-9"
                >
                  <div>
                    <div className="flex items-start justify-between gap-5">
                      <h2 className="font-display-tight text-h3 uppercase text-ink transition-colors group-hover:text-panel">
                        {area.city}, NC
                      </h2>
                      <ArrowIcon className="mt-1.5 shrink-0 text-slate-dim transition-all group-hover:translate-x-1 group-hover:text-tape" />
                    </div>
                    <p className="label mt-3 text-slate transition-colors group-hover:text-slate">
                      {area.county} · {area.driveTime}
                    </p>
                  </div>

                  <p className="text-sm leading-snug text-slate transition-colors group-hover:text-slate">
                    {area.intro}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="panel2">
        <Container>
          <SectionHeading
            label="Also covered"
            title="Surrounding communities"
            lead="Inside our normal radius. No dedicated page, same service."
          />

          <ul className="mt-10 flex flex-wrap gap-2">
            {additionalTowns.map((town) => (
              <li key={town} className="label border border-rule px-4 py-2.5 text-slate">
                {town}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-lg text-sm leading-snug text-slate">
            Outside the list? Commercial refrigeration emergencies are worth a call even if you are
            further out. {business.phoneDisplay}.
          </p>
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
