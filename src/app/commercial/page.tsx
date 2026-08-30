import type { Metadata } from "next";

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
} from "@/components/primitives";
import {
  PageHero,
  CapabilityRail,
  ServiceGrid,
  EmergencyCallout,
  ProcessSteps,
  BrandStrip,
  CTABand,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "Commercial Services",
  description:
    "Commercial refrigeration, kitchen equipment, HVAC, plumbing and electrical for restaurants, convenience stores, churches and property managers across Rowan, Cabarrus and Iredell counties, NC.",
  alternates: { canonical: "/commercial" },
};

const segments = [
  {
    title: "Restaurants",
    spec: "Walk-ins · Fryers · Ovens · Dish machines · Hoods · Grease traps",
    points: ["Scheduled around service hours", "Health inspection support", "Priority refrigeration"],
  },
  {
    title: "C-stores & grocery",
    spec: "Display cases · Reach-ins · Ice machines · Beverage systems",
    points: ["Multi-location coverage", "Case and rack systems", "Overnight work available"],
  },
  {
    title: "Churches & schools",
    spec: "Rooftop units · Kitchen equipment · Water heaters · Lighting",
    points: ["Between-service scheduling", "Fellowship hall kitchens", "Budget-conscious options"],
  },
  {
    title: "Property management",
    spec: "HVAC · Plumbing · Electrical · Appliances",
    points: ["Per-unit documentation", "Consolidated invoicing", "Turnover scheduling"],
  },
  {
    title: "Retail & office",
    spec: "Comfort cooling · Lighting · Panels · Break rooms",
    points: ["After-hours work", "Lighting retrofits", "Tenant fit-out support"],
  },
  {
    title: "Light industrial",
    spec: "Process cooling · Makeup air · Ventilation · Dedicated circuits",
    points: ["Dedicated circuits", "Makeup air balance", "Equipment hookups"],
  },
];

const faqs = [
  {
    q: "Can you work outside our business hours?",
    a: "Yes, and for most commercial customers that is the default. Kitchens get worked early morning or after close. Retail and offices get evenings or weekends. Tell us the window when you call.",
  },
  {
    q: "Do you handle multiple locations?",
    a: "Yes. Multi-location customers usually move to a maintenance agreement, so every site sits on a known schedule with one point of contact and consolidated documentation.",
  },
  {
    q: "How do you bill commercial work?",
    a: "You get the cost and the options before work starts. For agreement holders and multi-site customers we consolidate invoicing. Ask and we set it up the way your bookkeeping needs it.",
  },
  {
    q: "Can you provide documentation for inspections or insurance?",
    a: "Yes. Every visit can be documented with what failed, what was done, and verified readings where relevant. That is exactly what health inspectors and insurance carriers ask for.",
  },
  {
    q: "Why use one contractor for all six trades?",
    a: "Faults do not respect trade boundaries. A cooler that will not hold temperature might be refrigeration, electrical, or a failed control. When three companies each test only their own piece, you pay three service calls to find out. We test all of it.",
  },
];

export default function CommercialPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <PageHero
        label="For your business"
        title="Downtime is the real invoice."
        lead="A walk-in that fails Friday night costs the product, the weekend, and possibly the inspection. The repair is the small number."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Commercial", href: "/commercial" },
        ]}
      />

      <CapabilityRail />

      <Section tone="panel">
        <Container>
          <SectionHeading
            label="Clients"
            title="Businesses we serve"
            lead="Different buildings, same problem. Equipment that has to work, on a schedule that cannot absorb a three day wait."
          />

          <div className="mt-12 grid gap-px border-y border-rule bg-rule md:grid-cols-2 lg:grid-cols-3">
            {segments.map((segment, i) => (
              <Reveal key={segment.title} delay={i * 50}>
                <div className="flex h-full flex-col bg-panel p-7 lg:p-9">
                  <h3 className="font-display-tight text-h3 uppercase text-ink">{segment.title}</h3>
                  <p className="label mt-3.5 text-slate">{segment.spec}</p>
                  <ul className="mt-6 space-y-1.5 border-t border-rule pt-5">
                    {segment.points.map((point) => (
                      <li key={point} className="text-sm text-slate">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12">
              <EmergencyCallout />
            </div>
          </Reveal>
        </Container>
      </Section>

      <ServiceGrid
        label="Commercial capability"
        heading="Every trade, in-house"
        lead="No subcontractors, no markup on somebody else's work."
        filter="commercial"
        tone="panel2"
      />

      {/* Maintenance */}
      <Section tone="ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              label="Planned maintenance"
              title="Stop paying emergency rates"
              lead="Most emergency calls were preventable. A coil nobody cleaned, a gasket nobody replaced, a drain nobody cleared."
              tone="light"
            />

            <Reveal delay={80}>
              <div>
                <dl className="border-t border-rule-dark">
                  {[
                    ["Coil cleaning", "Biggest single cause of failure"],
                    ["Gasket & door checks", "Cheap now, expensive later"],
                    ["Temperature verification", "Documented for your file"],
                    ["Drain line service", "Prevents the overflow that closes you"],
                    ["Priority dispatch", "Ahead of the general queue"],
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
                    See maintenance plans
                    <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <ProcessSteps />

      <Section tone="panel">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Label>Questions</Label>
              <h2 className="font-display mt-5 text-h2 uppercase text-ink">Commercial FAQ</h2>
            </div>
            <Reveal>
              <FAQ faqs={faqs} />
            </Reveal>
          </div>
        </Container>
      </Section>

      <BrandStrip />
      <CTABand
        title="Put us on your call list."
        lead="Even with nothing broken today. A number covering all six trades is worth more than finding one at 6am on a Saturday."
      />
    </>
  );
}
