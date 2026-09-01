import type { Metadata } from "next";

import { business } from "@/config/business";
import { JsonLd } from "@/components/JsonLd";
import { FAQ } from "@/components/FAQ";
import { Reveal } from "@/components/Reveal";
import { faqSchema } from "@/lib/schema";
import {
  Container,
  Section,
  Label,
  SectionHeading,
  Button,
  ArrowIcon,
  PhoneIcon,
} from "@/components/primitives";
import { PageHero, CapabilityRail, CTABand } from "@/components/sections";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Maintenance Plans",
  description:
    "Planned maintenance agreements for commercial refrigeration, HVAC and kitchen equipment in Landis, NC. Scheduled service, priority dispatch, documented condition reports.",
  alternates: { canonical: "/maintenance-plans" },
};

const plans = [
  {
    name: "Essential",
    forWho: "Homes and small offices",
    cadence: "2 visits / year",
    includes: [
      "Cooling inspection each spring",
      "Heating inspection each fall",
      "Coil cleaning and filter service",
      "Refrigerant and airflow verification",
      "Safety and electrical checks",
      "Priority over non-agreement calls",
    ],
  },
  {
    name: "Commercial",
    forWho: "Restaurants, stores, churches",
    cadence: "Quarterly or monthly",
    includes: [
      "Everything in Essential, all equipment",
      "Walk-in condenser and evaporator service",
      "Gasket, door and seal inspection",
      "Documented temperature verification",
      "Drain line clearing",
      "Ice machine cleaning and sanitising",
      "Priority dispatch",
      "Written report every visit",
    ],
    featured: true,
  },
  {
    name: "Portfolio",
    forWho: "Property managers, multi-site",
    cadence: "Built to your schedule",
    includes: [
      "Everything in Commercial, every location",
      "Per-unit documentation",
      "Consolidated invoicing",
      "Turnover and make-ready scheduling",
      "One contact across all trades",
      "Annual capital replacement planning",
    ],
  },
];

const faqs = [
  {
    q: "What does an agreement cost?",
    a: "It depends how much equipment you run and how hard it works. A two-unit office is a very different number from a kitchen with three walk-ins and an ice machine. We walk the equipment, count it, and give you a flat monthly or per-visit price.",
  },
  {
    q: "Does it cover repairs too?",
    a: "The agreement covers the scheduled visits. Repairs found during those visits are quoted separately, but agreement holders get priority dispatch and we always tell you what we found before doing anything beyond the scheduled work.",
  },
  {
    q: "How often should commercial refrigeration be serviced?",
    a: "Quarterly suits most kitchens. Equipment in grease-heavy or dusty air, like fryer-line refrigeration or anything near a hood, often needs monthly coil attention. We set the interval on what we see, not a generic schedule.",
  },
  {
    q: "Is it worth it for one home system?",
    a: "For a system under about eight years old, generally yes. Twice-yearly service usually costs less than a single emergency call, and manufacturers require it to keep a warranty valid. For an older system near replacement we say so honestly.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. We would rather keep customers because the work is good than because a contract traps them.",
  },
];

export default async function MaintenancePlansPage() {
  const settings = await getSettings();
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <PageHero
        label="Planned maintenance"
        title="The cheapest repair is the one you never need"
        lead="Most emergency calls were preventable. A coil nobody cleaned, a gasket nobody replaced, a drain nobody cleared."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Maintenance Plans", href: "/maintenance-plans" },
        ]}
      />

      <CapabilityRail />

      {/* The argument */}
      <Section tone="ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              label="Why it pays"
              title="Run the numbers once"
              lead="A dirty condenser makes a compressor work harder, run hotter and fail earlier. Cleaning it is a routine visit."
              tone="light"
            />

            <Reveal delay={80}>
              <dl className="border-t border-rule-dark">
                {[
                  ["Planned visit", "Scheduled, quoted, done in your downtime"],
                  ["Emergency call", "After hours, priced accordingly"],
                  ["Lost product", "A full walk-in, gone in a few warm hours"],
                  ["Lost service", "Closed doors, or a menu you can't cook"],
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
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Plans */}
      <Section tone="panel">
        <Container>
          <SectionHeading
            label="Agreements"
            title="Three shapes, priced to your equipment"
            lead="Starting points, not rigid packages. We walk your equipment and build the agreement around it."
          />

          <div className="mt-12 grid gap-px border-y border-rule bg-rule lg:grid-cols-3">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 70}>
                <div
                  className={`flex h-full flex-col ${
                    plan.featured ? "on-dark bg-ink" : "bg-panel"
                  }`}
                >
                  {plan.featured ? (
                    <div className="tape-stripes h-2" aria-hidden />
                  ) : (
                    <div className="h-2" aria-hidden />
                  )}

                  <div className="flex flex-1 flex-col p-7 lg:p-9">
                    <Label>{plan.cadence}</Label>
                    <h3
                      className={`font-display mt-5 text-h2 uppercase leading-none ${
                        plan.featured ? "text-panel" : "text-ink"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    {/* text-slate and border-rule flip themselves via the
                        `on-dark` on the featured card, so no branching here. */}
                    <p className="mt-3 text-sm text-slate">{plan.forWho}</p>

                    <ul className="mt-7 flex-1 space-y-2.5 border-t border-rule pt-6">
                      {plan.includes.map((item) => (
                        <li key={item} className="text-sm leading-snug text-slate">
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <Button
                        href="/request-service"
                        variant={plan.featured ? "tape" : "outline"}
                        className="w-full"
                      >
                        Get a quote
                        <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-8 flex flex-wrap items-center gap-2 text-sm text-slate">
              Not sure which fits?
              <a
                href={settings.phoneHref}
                className="inline-flex items-center gap-2 font-semibold text-ink hover:underline"
              >
                <PhoneIcon />
                {settings.phoneDisplay}
              </a>
              Describe your equipment. Takes five minutes.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="panel2">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Label>Questions</Label>
              <h2 className="font-display mt-5 text-h2 uppercase text-ink">Agreement FAQ</h2>
            </div>
            <Reveal>
              <FAQ faqs={faqs} />
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTABand
        title="Get your equipment on a schedule."
        lead="Tell us roughly what you run. We walk it, count it, and give you a flat price."
      />
    </>
  );
}
