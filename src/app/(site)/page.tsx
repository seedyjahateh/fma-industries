import Link from "next/link";

import { business } from "@/config/business";
import { getSettings } from "@/lib/settings";
import { residentialServices } from "@/config/services";
import { Reveal } from "@/components/Reveal";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { DataPlate } from "@/components/DataPlate";
import { WorkStrip } from "@/components/Photos";
import {
  Container,
  Section,
  Label,
  SectionHeading,
  Button,
  Rise,
  ArrowIcon,
  PhoneIcon,
  BoltIcon,
} from "@/components/primitives";
import {
  CapabilityRail,
  ServiceGrid,
  ProcessSteps,
  AreaSection,
  BrandStrip,
  CTABand,
} from "@/components/sections";

/** Who calls, and what fails for them. Kept to a spec line each. */
const segments = [
  { title: "Restaurants", spec: "Walk-ins · Fryers · Dish machines · Hoods" },
  { title: "C-stores & grocery", spec: "Display cases · Ice machines · Beverage" },
  { title: "Churches & schools", spec: "Rooftop units · Kitchens · Water heaters" },
  { title: "Property management", spec: "HVAC · Plumbing · Electrical · Appliances" },
  { title: "Retail & office", spec: "Comfort cooling · Lighting · Panels" },
  { title: "Light industrial", spec: "Process cooling · Makeup air · Circuits" },
];

export default async function HomePage() {
  const settings = await getSettings();
  return (
    <>
      {/* ================================================================
          Hero
      ================================================================ */}
      <section className="grain relative isolate overflow-hidden border-b border-rule bg-panel pb-16 pt-32 md:pb-24 md:pt-44">
        <HeroBackdrop />

        <Container className="relative">
          <div className="grid gap-14 lg:grid-cols-[1.45fr_1fr] lg:items-end lg:gap-20">
            <div>
              <Rise>
                {/* No founding year: nobody has confirmed one. The 20+ figure
                    comes from the owner's own brief. */}
                <Label>
                  {business.address.city}, NC · {business.yearsExperience}+ years in the trade
                </Label>
              </Rise>

              {/* fade={false}: this h1 is the LCP element. */}
              <Rise delay={70} fade={false}>
                <h1 className="font-display mt-7 text-display uppercase text-ink">
                  When it breaks,
                  <br />
                  one call.
                </h1>
              </Rise>

              <Rise delay={140}>
                <p className="mt-8 max-w-md text-lead leading-snug text-slate">
                  Six trades under one contractor. Refrigeration, kitchen equipment, HVAC, plumbing,
                  electrical, appliances.
                </p>
              </Rise>

              <Rise delay={210}>
                <div className="mt-9 flex flex-wrap gap-2.5">
                  <Button href={settings.phoneHref} variant="tape" className="px-7 py-4">
                    <PhoneIcon />
                    {settings.phoneDisplay}
                  </Button>
                  <Button href="/request-service" variant="outline" className="px-7 py-4">
                    Request service
                    <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Rise>

              {settings.emergency.available && (
                <Rise delay={280}>
                  <p className="mt-7 flex items-center gap-2.5 text-sm text-slate">
                    <BoltIcon className="h-3.5 w-3.5 text-cold" />
                    Walk-in down after hours? Call {settings.emergency.display}.
                  </p>
                </Rise>
              )}
            </div>

            <Rise delay={180}>
              <DataPlate />
            </Rise>
          </div>
        </Container>
      </section>

      <CapabilityRail />

      {/* ================================================================
          The differentiator
      ================================================================ */}
      <Section tone="panel">
        <Container>
          <SectionHeading label="Why one contractor" title="Most shops fix one thing." />

          {/* The scenario, then the answer, then the consequences. Full width
              at each step so nothing leaves a dead column beside it. */}
          <Reveal>
            <p className="font-display-tight mt-10 max-w-4xl text-h3 uppercase leading-snug text-ink">
              A walk-in goes down. Refrigeration says it&apos;s electrical. The electrician says
              it&apos;s the equipment. Three days, two invoices, and the cooler is still warm.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-10 border-l-2 border-tape bg-panel-2 p-6 md:p-8">
              <p className="max-w-2xl text-lead leading-snug text-ink">
                We hold all six trades in-house, so a fault can be followed across the trade line
                instead of stopping at it. That line is usually where the problem lives.
              </p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <dl className="mt-10 grid gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["One invoice", "One point of accountability"],
                ["No second schedule", "Nobody waits on another contractor"],
                ["Faults traced across", "Not stopped at the boundary"],
                ["Same technician", "Already knows your building"],
              ].map(([term, def]) => (
                <div key={term} className="bg-panel p-6">
                  <dt className="font-display-tight text-sm uppercase text-ink">{term}</dt>
                  <dd className="mt-2 text-sm leading-snug text-slate">{def}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      {/* ================================================================
          Who we keep running
      ================================================================ */}
      <Section tone="panel2">
        <Container>
          <SectionHeading
            label="Clients"
            title="Built for businesses that can't absorb downtime"
            lead="When a cooler fails, the repair is the small number."
          />

          <div className="mt-12 grid gap-px border-y border-rule bg-rule md:grid-cols-2 lg:grid-cols-3">
            {segments.map((segment, i) => (
              <Reveal key={segment.title} delay={i * 50}>
                <div className="h-full bg-panel-2 p-7 lg:p-9">
                  <h3 className="font-display-tight text-h3 uppercase text-ink">{segment.title}</h3>
                  <p className="label mt-4 text-slate">{segment.spec}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10">
              <Button href="/commercial" variant="outline">
                Commercial services
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <ServiceGrid
        label="Capability"
        heading="Six trades, in-house"
        lead="Work we do ourselves. Not subcontracted and marked up."
      />

      {/* ================================================================
          Maintenance
      ================================================================ */}
      <Section tone="ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              label="Planned maintenance"
              title="The cheapest repair is the one you never need"
              lead="Coils cleaned, gaskets checked, temperatures verified, drains cleared. Before any of it becomes a 6am phone call."
              tone="light"
            />

            <Reveal delay={100}>
              <div>
                <dl className="border-t border-rule-dark">
                  {[
                    ["Scheduled visits", "Interval matched to your equipment"],
                    ["Priority dispatch", "Ahead of the general queue"],
                    ["Documented condition", "For inspectors, landlords, insurers"],
                    ["Early fault detection", "Caught while still cheap"],
                  ].map(([term, def]) => (
                    <div
                      key={term}
                      className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-rule-dark py-4"
                    >
                      <dt className="font-display-tight text-sm uppercase text-panel">{term}</dt>
                      <dd className="label text-slate">{def}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8">
                  <Button href="/maintenance-plans" variant="tape">
                    Maintenance plans
                    <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <ProcessSteps />

      {/* Renders nothing until src/config/photos.ts has entries. */}
      <WorkStrip />

      <AreaSection />
      <BrandStrip />

      {/* ================================================================
          Residential
      ================================================================ */}
      <Section tone="panel2">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <SectionHeading
                label="For your home"
                title="Same technician. Same standard."
                lead="Heat that quit in January. An AC that gave up in July. A refrigerator that stopped cooling."
              />
              <div className="mt-8">
                <Button href="/residential" variant="outline">
                  Residential services
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            <div className="self-start border-t border-rule">
              {residentialServices.map((service, i) => (
                <Reveal key={service.slug} delay={i * 45}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex items-baseline justify-between gap-6 border-b border-rule py-5 transition-colors hover:bg-panel"
                  >
                    <span className="font-display-tight text-base uppercase text-ink">
                      {service.shortName}
                    </span>
                    <span className="flex items-baseline gap-5">
                      <span className="label hidden text-slate sm:inline">{service.summary}</span>
                      <ArrowIcon className="h-3.5 w-3.5 shrink-0 self-center text-slate-dim transition-all group-hover:translate-x-1 group-hover:text-ink" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
