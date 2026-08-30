import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { business } from "@/config/business";
import { services, getService } from "@/config/services";
import { areas } from "@/config/areas";
import { JsonLd } from "@/components/JsonLd";
import { FAQ } from "@/components/FAQ";
import { Reveal } from "@/components/Reveal";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import {
  Container,
  Section,
  Label,
  SectionHeading,
  ArrowIcon,
} from "@/components/primitives";
import {
  PageHero,
  CapabilityRail,
  EmergencyCallout,
  BrandStrip,
  CTABand,
} from "@/components/sections";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata(
  props: PageProps<"/services/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `${business.siteUrl}/services/${service.slug}`,
    },
  };
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service),
          faqSchema(service.faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
        ]}
      />

      <PageHero
        label={service.audience.join(" · ")}
        title={service.name}
        lead={service.intro}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.shortName, href: `/services/${service.slug}` },
        ]}
        aside={
          <div className="border border-ink bg-panel">
            <div className="tape-stripes h-2" aria-hidden />
            <div className="px-6 py-5">
              <Label>Equipment serviced</Label>
              <ul className="mt-4 space-y-2">
                {service.equipment.slice(0, 6).map((item) => (
                  <li key={item} className="border-b border-rule pb-2 text-sm text-ink last:border-0">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      <CapabilityRail />

      {/* Full equipment list */}
      <Section tone="panel">
        <Container>
          <SectionHeading label="Scope" title="Everything we touch" />

          <ul className="mt-10 grid gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {service.equipment.map((item) => (
              <li key={item} className="bg-panel px-5 py-4 text-sm text-ink">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Symptoms */}
      <Section tone="ink">
        <Container>
          <SectionHeading
            label="Common calls"
            title="Sound familiar?"
            lead="If any of these describe your problem, it is a call we take regularly."
            tone="light"
          />

          <ul className="mt-10 grid gap-px border-y border-rule-dark bg-rule-dark sm:grid-cols-2 lg:grid-cols-4">
            {service.symptoms.map((symptom) => (
              <li
                key={symptom}
                className="font-display-tight bg-ink p-6 text-sm uppercase leading-snug text-panel"
              >
                {symptom}
              </li>
            ))}
          </ul>

          {service.emergencyPriority && (
            <Reveal>
              <p className="label mt-10 text-slate">
                Refrigeration and heating failures are triaged ahead of scheduled work.
              </p>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="panel">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading label="Questions" title="Straight answers" />
            </div>
            <Reveal>
              <FAQ faqs={service.faqs} />
            </Reveal>
          </div>
        </Container>
      </Section>

      {service.emergencyPriority && (
        <Section tone="panel2">
          <Container>
            <EmergencyCallout />
          </Container>
        </Section>
      )}

      {/* Coverage + other trades */}
      <Section tone="panel">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                label="Coverage"
                title={`${service.shortName} across the area`}
                lead={`Based in ${business.address.city}. Rowan, Cabarrus and Iredell counties.`}
              />
              <ul className="mt-8 flex flex-wrap gap-2">
                {areas.map((area) => (
                  <li key={area.slug}>
                    <Link
                      href={`/service-areas/${area.slug}`}
                      className="label inline-block border border-rule px-3.5 py-2.5 text-slate transition-colors hover:border-ink hover:text-ink"
                    >
                      {area.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading
                label="Also in-house"
                title="While we're on site"
                lead="A second problem does not mean a second contractor."
              />
              <div className="mt-8 border-t border-rule">
                {others.map((other, i) => (
                  <Reveal key={other.slug} delay={i * 40}>
                    <Link
                      href={`/services/${other.slug}`}
                      className="group flex items-baseline justify-between gap-6 border-b border-rule py-4 transition-colors hover:bg-panel-2"
                    >
                      <span className="font-display-tight text-sm uppercase text-ink">
                        {other.name}
                      </span>
                      <ArrowIcon className="shrink-0 self-center text-slate-dim transition-all group-hover:translate-x-1 group-hover:text-ink" />
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <BrandStrip />
      <CTABand
        title={`Need ${service.shortName.toLowerCase()} service?`}
        lead="Send the make, model and a photo of the data plate. We bring the right part the first time."
      />
    </>
  );
}
