import type { Metadata } from "next";

/**
 * NOTE: written only from confirmed facts. 20+ years in the trade, based in
 * Landis NC, six trades in-house. No invented biography: no fabricated names,
 * dates, military service, apprenticeships, or customer stories.
 *
 * TODO with the owner: how he started, whether "& Son" is literal, the first
 * trade he learned, and one or two real jobs he is proud of. Those details are
 * what would turn this page from good into genuinely persuasive.
 */

import { business, fullAddress } from "@/config/business";
import { Reveal } from "@/components/Reveal";
import {
  Container,
  Section,
  Label,
  SectionHeading,
  SpecRow,
} from "@/components/primitives";
import { PageHero, CapabilityRail, BrandStrip, CTABand } from "@/components/sections";

export const metadata: Metadata = {
  title: "About",
  description: `${business.name} has served Landis, NC and the surrounding Rowan, Cabarrus and Iredell county area for over ${business.yearsExperience} years. Refrigeration, HVAC, kitchen equipment, plumbing, electrical and appliances.`,
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Diagnose before you replace",
    body: "Swapping parts until the symptom stops is guessing, and you pay for every guess.",
  },
  {
    title: "Price before the work",
    body: "Cost and options before anything starts. No invoice bigger than the conversation was.",
  },
  {
    title: "Cross the trade lines",
    body: "Stubborn faults live where one trade hands off to another. We hold all six.",
  },
  {
    title: "Answer the phone",
    body: "A person, not an answering service reading from a script.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label={`${business.address.city}, NC · ${business.yearsExperience}+ years`}
        title="Twenty years of other people's emergencies."
        lead={`${business.name} has kept equipment running across ${business.address.county} and the surrounding area for over ${business.yearsExperience} years. Restaurants, stores, churches, rental portfolios, and the homes in between.`}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
        aside={
          <div className="border border-ink bg-panel">
            <div className="tape-stripes h-2" aria-hidden />
            <div className="px-6 py-4">
              <Label>Record</Label>
              <dl className="mt-3">
                <SpecRow k="Trades" v="06" />
                <SpecRow k="Counties" v="04" />
                <SpecRow k="Base" v={`${business.address.city}, ${business.address.state}`} />
              </dl>
            </div>
          </div>
        }
      />

      <CapabilityRail />

      {/* Story */}
      <Section tone="panel">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading label="Who we are" title="Six trades is unusual. That's the point." />
            </div>

            <div className="space-y-5">
              <Reveal>
                <p className="font-display-tight text-h3 uppercase leading-snug text-ink">
                  Most contractors pick a lane. That works right up until your problem sits between
                  two of them.
                </p>
              </Reveal>

              <Reveal delay={70}>
                <p className="text-lead leading-snug text-slate">
                  Twenty years of service calls teaches you that a walk-in which will not hold
                  temperature might be a failed compressor, a bad contactor, a tripped circuit, a
                  clogged drain, or a door gasket somebody meant to replace in spring. That is four
                  trades and one very warm cooler.
                </p>
              </Reveal>

              <Reveal delay={120}>
                <p className="text-lead leading-snug text-slate">
                  We built the business the other way around. Refrigeration, HVAC, kitchen
                  equipment, plumbing, electrical and appliances, all in-house. One number, one
                  invoice, and one person still responsible after the first thing we tried did not
                  fix it.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Principles */}
      <Section tone="ink">
        <Container>
          <SectionHeading label="How we work" title="Four things we don't compromise on" tone="light" />

          <div className="mt-12 grid gap-px border-y border-rule-dark bg-rule-dark sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 60}>
                <div className="h-full bg-ink p-7 lg:p-9">
                  <h3 className="font-display-tight text-h3 uppercase text-panel">
                    {principle.title}
                  </h3>
                  <p className="mt-3.5 text-sm leading-snug text-slate-2">{principle.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Credentials */}
      <Section tone="panel">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              label="Credentials"
              title="Licensed, insured, happy to prove it"
              lead="Ask this of every contractor who comes to your door. Ask us on the phone and we give you the numbers before anything is scheduled."
            />

            <Reveal delay={80}>
              <dl className="border-t border-rule">
                {business.licenses.map((license) => (
                  <SpecRow key={license.trade} k={license.trade} v={`#${license.number}`} />
                ))}
                {business.insured && <SpecRow k="Insurance" v="Certificate on request" />}
                <SpecRow k="In trade" v={`${business.yearsExperience}+ years`} />
                <SpecRow k="Based" v={fullAddress} />
              </dl>
            </Reveal>
          </div>
        </Container>
      </Section>

      <BrandStrip />
      <CTABand
        title="Put a real number in your phone."
        lead="The best time to find a contractor is before you need one."
      />
    </>
  );
}
