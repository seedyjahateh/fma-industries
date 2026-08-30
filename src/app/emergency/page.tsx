import type { Metadata } from "next";

import { business, emergencyPhone } from "@/config/business";
import { JsonLd } from "@/components/JsonLd";
import { FAQ } from "@/components/FAQ";
import { Reveal } from "@/components/Reveal";
import { faqSchema } from "@/lib/schema";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import {
  Container,
  Section,
  Label,
  SectionHeading,
  Rise,
  PhoneIcon,
  MessageIcon,
  BoltIcon,
} from "@/components/primitives";
import { CapabilityRail } from "@/components/sections";

export const metadata: Metadata = {
  title: "24/7 Emergency Service",
  description:
    "Emergency commercial refrigeration and HVAC service in Landis, NC and Rowan, Cabarrus and Iredell counties. Walk-in down, no heat, no cooling. Call day or night.",
  alternates: { canonical: "/emergency" },
};

const qualifies = [
  "Walk-in or freezer above temperature with product inside",
  "Ice machine or display case down during service",
  "No heat in a freeze, no cooling in extreme heat",
  "Kitchen equipment failure mid-service",
  "Water leak you can't shut off at a fixture",
  "Burning smell, sparking, or a breaker that won't set",
  "Gas smell near a line or appliance",
  "Refrigeration failure at a grocery or c-store",
];

/** Genuinely sequential, so genuinely numbered. */
const triage = [
  {
    title: "Refrigeration above temperature",
    steps: [
      "Move product to another working box or onto ice. Inventory first.",
      "Log the temperature and the time. Your inspector and insurer will ask.",
      "Check whether the coil is iced over. That is useful information for us.",
      "Keep the door closed. Every open is warm air you pay to remove.",
    ],
  },
  {
    title: "No heat or no cooling",
    steps: [
      "Check the thermostat is calling and has power or fresh batteries.",
      "Check the breaker and any disconnect switch at the unit.",
      "Look at the filter. A blocked filter can shut a system down on a safety.",
      "If the outdoor unit is iced over, switch it off and let it thaw.",
    ],
  },
  {
    title: "Electrical fault",
    steps: [
      "Burning smell or sparking: kill the breaker to that circuit now.",
      "Do not keep resetting a breaker that trips again. It trips for a reason.",
      "Unplug equipment on the affected circuit before we arrive.",
      "Note exactly what was running when it tripped.",
    ],
  },
  {
    title: "Water or gas",
    steps: [
      "Water: shut the fixture valve, or the main if you cannot isolate it.",
      "Gas: do not switch anything on or off. Leave and call from outside.",
      "Gas: if the smell is strong, call 911 and the utility before calling us.",
      "Keep water away from electrical panels and equipment.",
    ],
  },
];

const faqs = [
  {
    q: "What counts as an emergency?",
    a: "Anything actively costing you product, revenue or safety. Refrigeration above temperature with stock in it, no heat during a freeze, kitchen equipment down mid-service, or an electrical or gas fault. If you are unsure, call and describe it.",
  },
  {
    q: "How fast will you get here?",
    a: "It depends where you are and what is already in the queue. What we will do is answer the phone, tell you honestly where you sit, and give you a realistic window instead of saying 'on our way' and arriving four hours later.",
  },
  {
    q: "Does emergency service cost more?",
    a: "After-hours and weekend calls carry a higher rate, as they do with every contractor in the trade. We tell you the rate on the phone, not on the invoice afterwards.",
  },
  {
    q: "Should I use the form for an emergency?",
    a: "No. Call. The form is good for scheduled work and for sending equipment details in advance, but nobody watches an inbox at 2am.",
  },
  {
    q: "Do you cover emergencies outside your service area?",
    a: "Sometimes, commercial refrigeration in particular. Call and ask rather than assuming the answer is no.",
  },
];

export default function EmergencyPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      {/* Hero. Call-first, no competing CTAs. */}
      <section className="grain relative isolate overflow-hidden border-b border-rule bg-panel pb-16 pt-32 md:pb-24 md:pt-44">
        <HeroBackdrop />

        <Container className="relative">
          <Rise>
            <Label className="flex items-center gap-2">
              <BoltIcon className="h-3 w-3" />
              {business.emergency.label}
            </Label>

            <h1 className="font-display mt-6 max-w-3xl text-display-sm uppercase text-ink">
              Equipment down? Call, don&apos;t type.
            </h1>

            <p className="mt-6 max-w-lg text-lead leading-snug text-slate">
              Emergencies are triaged by phone. You find out where you stand immediately instead of
              waiting on an inbox nobody is reading at 2am.
            </p>
          </Rise>

          <Rise delay={100}>
            <a
              href={emergencyPhone.href}
              className="mt-9 inline-flex items-center gap-4 bg-tape px-8 py-5 transition-colors hover:bg-ink hover:text-tape"
            >
              <PhoneIcon className="h-5 w-5" />
              <span className="font-display text-xl uppercase leading-none sm:text-2xl">
                {emergencyPhone.display}
              </span>
            </a>

            {business.smsHref && (
              <p className="mt-5">
                <a
                  href={business.smsHref}
                  className="inline-flex items-center gap-2.5 text-sm text-slate transition-colors hover:text-ink"
                >
                  <MessageIcon />
                  Can&apos;t talk? Text your address and the equipment.
                </a>
              </p>
            )}
          </Rise>
        </Container>
      </section>

      <CapabilityRail />

      {/* What qualifies */}
      <Section tone="panel">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                label="When to call"
                title="What counts as an emergency"
                lead="If it is actively costing you product, revenue or safety, it qualifies."
              />
            </div>

            <ul className="border-t border-rule">
              {qualifies.map((item) => (
                <li key={item} className="border-b border-rule py-4 text-sm text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Triage */}
      <Section tone="ink">
        <Container>
          <SectionHeading
            label="While you wait"
            title="What to do before we arrive"
            lead="None of this replaces the repair. It can save your inventory, protect the building, and sometimes fix the problem outright."
            tone="light"
          />

          <div className="mt-12 grid gap-px border-y border-rule-dark bg-rule-dark md:grid-cols-2">
            {triage.map((block, i) => (
              <Reveal key={block.title} delay={i * 60}>
                <div className="h-full bg-ink p-7 lg:p-9">
                  <h3 className="font-display-tight text-h3 uppercase text-panel">{block.title}</h3>
                  <ol className="mt-6 space-y-3.5">
                    {block.steps.map((step, index) => (
                      <li key={step} className="flex gap-4 text-sm leading-snug text-slate-2">
                        <span className="font-display tabular shrink-0 text-xs text-tape">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-10 border-l-2 border-tape pl-5 text-sm leading-snug text-panel">
              If you smell gas strongly, leave the building and call 911 and your gas utility before
              you call us. Do not switch anything on or off on your way out.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="panel">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Label>Questions</Label>
              <h2 className="font-display mt-5 text-h2 uppercase text-ink">Emergency FAQ</h2>
            </div>
            <Reveal>
              <FAQ faqs={faqs} />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Closing. Call only. */}
      <section className="border-t border-rule bg-panel-2 py-16 text-center md:py-24">
        <Container>
          <Label className="justify-center">Right now</Label>
          <h2 className="font-display mx-auto mt-5 max-w-xl text-h2 uppercase text-ink">
            Don&apos;t wait on a form.
          </h2>
          <a
            href={emergencyPhone.href}
            className="mt-8 inline-flex items-center gap-4 bg-tape px-8 py-5 transition-colors hover:bg-ink hover:text-tape"
          >
            <PhoneIcon className="h-5 w-5" />
            <span className="font-display text-xl uppercase leading-none sm:text-2xl">
              {emergencyPhone.display}
            </span>
          </a>
        </Container>
      </section>
    </>
  );
}
