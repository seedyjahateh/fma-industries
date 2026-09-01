import type { Metadata } from "next";

import { business } from "@/config/business";
import { JsonLd } from "@/components/JsonLd";
import { FAQ } from "@/components/FAQ";
import { Reveal } from "@/components/Reveal";
import { faqSchema } from "@/lib/schema";
import { Container, Section, Label, SectionHeading } from "@/components/primitives";
import {
  PageHero,
  CapabilityRail,
  ServiceGrid,
  ProcessSteps,
  AreaSection,
  CTABand,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "Residential Services",
  description:
    "Home HVAC, plumbing, electrical and appliance repair in Landis, China Grove, Kannapolis and Salisbury, NC. Straight answers on repair versus replace.",
  alternates: { canonical: "/residential" },
};

const promises = [
  {
    title: "The honest number",
    body: "If a repair costs more than the appliance is worth, we say so and walk away from the job. Nobody here works on commission.",
  },
  {
    title: "One contractor, not four",
    body: "Heat pump, water heater, panel, dryer. Same number, same person, same standard.",
  },
  {
    title: "We show up when we say",
    body: "If something runs long you get a call before the window closes, not after.",
  },
  {
    title: "The house gets left clean",
    body: "Drop cloths, shoe covers, old parts hauled off.",
  },
];

const faqs = [
  {
    q: "Do you charge for a service call?",
    a: "There is a fee to come out and diagnose, covering the trip and the technician's time. Ask when you call and we tell you the number up front, plus how it applies if you approve the repair.",
  },
  {
    q: "Should I repair or replace my HVAC system?",
    a: "It depends on the age of the equipment, what failed, and the refrigerant it uses. You get the cost of the repair and the cost of replacement, then you decide. No commission rides on which one you pick.",
  },
  {
    q: "How quickly can you come out?",
    a: "No heat during a freeze, or no cooling in a heat wave, gets same-day attention whenever we can manage it. Routine work is usually within a few business days.",
  },
  {
    q: "Do you work on appliances other companies won't touch?",
    a: "Often, yes. The refrigeration and electrical background behind commercial equipment applies directly to home appliances, so we can frequently repair units a parts-swapper would give up on.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes. Ask for our current license numbers when you call and we give them to you before anything is scheduled. You should ask that of every contractor who comes to your door.",
  },
];

export default function ResidentialPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <PageHero
        label="For your home"
        title="The heat quit. Now what?"
        lead={`Home HVAC, plumbing, electrical and appliance repair around ${business.address.city}. The same technician who keeps restaurant equipment running.`}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Residential", href: "/residential" },
        ]}
      />

      <CapabilityRail />

      <Section tone="panel">
        <Container>
          <SectionHeading
            label="What to expect"
            title="No upsell, no runaround"
            lead="Most people's experience with home contractors is a quote for a system they did not need."
          />

          <div className="mt-12 grid gap-px border-y border-rule bg-rule sm:grid-cols-2">
            {promises.map((promise, i) => (
              <Reveal key={promise.title} delay={i * 60}>
                <div className="h-full bg-panel p-7 lg:p-9">
                  <h3 className="font-display-tight text-h3 uppercase text-ink">{promise.title}</h3>
                  <p className="mt-3.5 text-sm leading-snug text-slate">{promise.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <ServiceGrid
        label="Home services"
        heading="What we do at the house"
        lead="Repair, replacement and maintenance, with commercial-grade diagnostic habits."
        filter="residential"
        tone="panel2"
      />

      <ProcessSteps />
      <AreaSection />

      <Section tone="panel2">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Label>Questions</Label>
              <h2 className="font-display mt-5 text-h2 uppercase text-ink">Homeowner FAQ</h2>
            </div>
            <Reveal>
              <FAQ faqs={faqs} />
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTABand
        title="Something not working right?"
        lead="Tell us the appliance and what it is doing. A photo of the model sticker helps us bring the right part."
      />
    </>
  );
}
