import Link from "next/link";
import type { ReactNode } from "react";

import { business, brands, emergencyPhone } from "@/config/business";
import { services } from "@/config/services";
import { areas, counties } from "@/config/areas";
import { Reveal } from "./Reveal";
import { HeroBackdrop } from "./HeroBackdrop";
import {
  Container,
  Section,
  Label,
  SectionHeading,
  Button,
  Rise,
  Stat,
  ArrowIcon,
  PhoneIcon,
  BoltIcon,
} from "./primitives";

/* =========================================================================
   Inner-page hero
========================================================================= */

export function PageHero({
  label,
  title,
  lead,
  breadcrumb,
  aside,
}: {
  label?: string;
  title: ReactNode;
  lead?: ReactNode;
  breadcrumb?: { label: string; href: string }[];
  aside?: ReactNode;
}) {
  return (
    <section className="grain relative isolate overflow-hidden border-b border-rule bg-panel pb-14 pt-32 md:pb-20 md:pt-40">
      <HeroBackdrop />

      <Container className="relative">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="label flex flex-wrap items-center gap-2 text-slate-2">
              {breadcrumb.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  <Link href={crumb.href} className="transition-colors hover:text-ink">
                    {crumb.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className={aside ? "grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16" : ""}>
          <div>
            <Rise>
              {label && <Label>{label}</Label>}
              <h1 className="font-display mt-5 max-w-3xl text-display-sm uppercase text-ink">
                {title}
              </h1>
              {lead && <p className="mt-6 max-w-xl text-lead leading-snug text-slate">{lead}</p>}
            </Rise>

            <Rise delay={100}>
              <div className="mt-9 flex flex-wrap gap-2.5">
                <Button href={business.phoneHref} variant="tape">
                  <PhoneIcon />
                  {business.phoneDisplay}
                </Button>
                <Button href="/request-service" variant="outline">
                  Request service
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </Rise>
          </div>

          {aside && <Rise delay={180}>{aside}</Rise>}
        </div>
      </Container>
    </section>
  );
}

/* =========================================================================
   Capability rail
========================================================================= */

export function CapabilityRail() {
  const items = [
    { value: "20", unit: "+", caption: "Years in trade" },
    { value: "06", caption: "Trades in-house" },
    ...(business.emergency.available ? [{ value: "24/7", caption: "Emergency line" }] : []),
    { value: "04", caption: "Counties served" },
  ];

  return (
    <div className="border-y border-rule bg-panel-2">
      <Container>
        <div className="grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:gap-8">
          {items.map((item) => (
            <Stat key={item.caption} value={item.value} unit={item.unit} caption={item.caption} />
          ))}
        </div>
      </Container>
    </div>
  );
}

/* =========================================================================
   Services

   No decorative numbering. These are six parallel capabilities, not a
   sequence, so numbering them would encode something untrue.
========================================================================= */

export function ServiceGrid({
  heading = "What we service",
  label = "Capability",
  lead,
  filter,
  tone = "panel",
}: {
  heading?: string;
  label?: string;
  lead?: ReactNode;
  filter?: "commercial" | "residential";
  tone?: "panel" | "panel2";
}) {
  const list = filter ? services.filter((s) => s.audience.includes(filter)) : services;

  return (
    <Section tone={tone}>
      <Container>
        <SectionHeading label={label} title={heading} lead={lead} />

        <div className="mt-12 grid gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service, i) => (
            <Reveal key={service.slug} delay={i * 50}>
              <Link
                href={`/services/${service.slug}`}
                className={`group relative flex h-full flex-col justify-between gap-10 p-7 transition-colors duration-200 hover:bg-ink lg:p-9 ${
                  tone === "panel2" ? "bg-panel-2" : "bg-panel"
                }`}
              >
                <div>
                  <h3 className="font-display-tight text-h3 uppercase leading-tight text-ink transition-colors group-hover:text-panel">
                    {service.name}
                  </h3>
                  <p className="label mt-4 text-slate transition-colors group-hover:text-slate-2">
                    {service.summary}
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 self-start bg-ink px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-panel transition-colors group-hover:bg-tape group-hover:text-ink">
                  View
                  <ArrowIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* =========================================================================
   Process — genuinely sequential, so genuinely numbered
========================================================================= */

const processSteps = [
  { title: "You call", body: "A person picks up. Tell us the equipment and the symptom." },
  { title: "We diagnose", body: "We find the fault. No parts-swapping until the symptom stops." },
  { title: "You approve", body: "Cost and options before work starts, repair or replace." },
  { title: "We document", body: "What failed and why, in writing, for your file." },
];

export function ProcessSteps() {
  return (
    <Section tone="ink">
      <Container>
        <SectionHeading
          label="Procedure"
          title="Four steps, every call"
          lead="The same whether it is a walk-in at 2am or a dryer that stopped heating."
          tone="light"
        />

        <ol className="mt-12 grid gap-px border-y border-rule-dark bg-rule-dark md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <Reveal key={step.title} delay={i * 70} as="li">
              <div className="h-full bg-ink p-7 lg:p-9">
                <div className="flex items-center gap-3">
                  <span className="font-display tabular text-sm text-tape">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-rule-dark" />
                </div>
                <h3 className="font-display-tight mt-6 text-base uppercase text-panel">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-snug text-slate-2">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* =========================================================================
   Emergency callout
========================================================================= */

export function EmergencyCallout() {
  if (!business.emergency.available) return null;

  return (
    <div className="border border-ink bg-panel-2">
      <div className="tape-stripes h-2" aria-hidden />
      <div className="flex flex-wrap items-center justify-between gap-6 p-7 md:p-9">
        <div>
          <Label className="flex items-center gap-2">
            <BoltIcon className="h-3 w-3" />
            Emergency line
          </Label>
          <p className="font-display-tight mt-4 text-h3 uppercase text-ink">
            Equipment down right now?
          </p>
          <p className="mt-2 max-w-md text-sm leading-snug text-slate">
            Call. Emergencies are triaged by phone, so you find out where you stand immediately.
          </p>
        </div>

        <Button href={emergencyPhone.href} variant="tape">
          <PhoneIcon />
          {emergencyPhone.display}
        </Button>
      </div>
    </div>
  );
}

/* =========================================================================
   Brands — marquee, doubled for a seamless loop
========================================================================= */

export function BrandStrip() {
  const run = [...brands, ...brands];

  return (
    <div className="overflow-hidden border-y border-rule bg-panel py-10">
      <Container>
        <Label>Brands serviced</Label>
      </Container>

      <div className="marquee mt-7 flex w-max gap-10 pl-5 md:pl-10">
        {run.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="font-display-tight shrink-0 text-xl uppercase text-slate-dim md:text-2xl"
          >
            {brand}
          </span>
        ))}
      </div>

      <Container className="mt-7">
        <p className="text-sm text-slate">
          Not listed? We service most major commercial and residential brands.
        </p>
      </Container>
    </div>
  );
}

/* =========================================================================
   Service area
========================================================================= */

export function AreaSection() {
  return (
    <Section tone="panel">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              label="Coverage"
              title={
                <>
                  Based in Landis.
                  <br />
                  On the road daily.
                </>
              }
              lead={`${counties.slice(0, -1).join(", ")} and ${counties.at(-1)}. Roughly a 30 mile radius.`}
            />
            <div className="mt-8">
              <Button href="/service-areas" variant="outline">
                All areas
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          <div className="border-t border-rule">
            {areas.map((area, i) => (
              <Reveal key={area.slug} delay={i * 35}>
                <Link
                  href={`/service-areas/${area.slug}`}
                  className="group flex items-baseline justify-between gap-6 border-b border-rule py-5 transition-colors hover:bg-panel-2"
                >
                  <span className="font-display-tight text-base uppercase text-ink transition-colors group-hover:text-cold">
                    {area.city}, NC
                  </span>
                  <span className="flex items-baseline gap-6">
                    <span className="label hidden text-slate-2 sm:inline">{area.county}</span>
                    <span className="label tabular w-28 text-right text-slate">
                      {area.driveTime}
                    </span>
                    <ArrowIcon className="h-3.5 w-3.5 shrink-0 self-center text-slate-dim transition-all group-hover:translate-x-1 group-hover:text-ink" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* =========================================================================
   Closing CTA
========================================================================= */

export function CTABand({
  title = "Tell us what's broken.",
  lead = "Send the make, model, and a photo of the data plate. We arrive with the right part.",
}: {
  title?: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <section className="grain grain-dark relative isolate overflow-hidden border-t border-rule bg-ink py-16 md:py-24">
      <HeroBackdrop tone="dark" />

      <Container className="on-dark relative">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Label tone="light">Get service</Label>
            <h2 className="font-display mt-5 max-w-xl text-h2 uppercase text-panel">{title}</h2>
            <p className="mt-5 max-w-md text-lead leading-snug text-slate-2">{lead}</p>
          </div>

          <div className="flex flex-wrap gap-2.5 lg:justify-end">
            <Button href={business.phoneHref} variant="tape">
              <PhoneIcon />
              {business.phoneDisplay}
            </Button>
            <Button href="/request-service" variant="outlineDark">
              Request service
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
