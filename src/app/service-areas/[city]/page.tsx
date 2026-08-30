import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { business, emergencyPhone } from "@/config/business";
import { areas, getArea } from "@/config/areas";
import { services, getService } from "@/config/services";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { areaSchema, breadcrumbSchema } from "@/lib/schema";
import {
  Container,
  Section,
  Label,
  SectionHeading,
  SpecRow,
  ArrowIcon,
} from "@/components/primitives";
import { PageHero, CapabilityRail, EmergencyCallout, CTABand } from "@/components/sections";

export function generateStaticParams() {
  return areas.map((area) => ({ city: area.slug }));
}

export async function generateMetadata(
  props: PageProps<"/service-areas/[city]">
): Promise<Metadata> {
  const { city } = await props.params;
  const area = getArea(city);
  if (!area) return {};

  return {
    title: area.metaTitle,
    description: area.metaDescription,
    alternates: { canonical: `/service-areas/${area.slug}` },
    openGraph: {
      title: area.metaTitle,
      description: area.metaDescription,
      url: `${business.siteUrl}/service-areas/${area.slug}`,
    },
  };
}

export default async function AreaPage(props: PageProps<"/service-areas/[city]">) {
  const { city } = await props.params;
  const area = getArea(city);
  if (!area) notFound();

  const featured = area.emphasis
    .map((slug) => getService(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const nearby = areas.filter((a) => a.slug !== area.slug).slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          areaSchema(area.city, area.county),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Service Areas", path: "/service-areas" },
            { name: area.city, path: `/service-areas/${area.slug}` },
          ]),
        ]}
      />

      <PageHero
        label={`${area.county} · ${area.driveTime}`}
        title={`Service in ${area.city}, NC`}
        lead={area.intro}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Service Areas", href: "/service-areas" },
          { label: area.city, href: `/service-areas/${area.slug}` },
        ]}
        aside={
          <div className="border border-ink bg-panel">
            <div className="tape-stripes h-2" aria-hidden />
            <div className="px-6 py-4">
              <Label>Coverage detail</Label>
              <dl className="mt-3">
                <SpecRow k="From base" v={area.driveTime} />
                <SpecRow k="County" v={area.county.replace(" County", "")} />
                <SpecRow k="Trades" v="All six" />
                <SpecRow
                  k="Emergency"
                  v={business.emergency.available ? "24 / 7" : "By appointment"}
                />
              </dl>
            </div>
          </div>
        }
      />

      <CapabilityRail />

      {/* Local context */}
      <Section tone="panel">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <Label>On the ground in {area.city}</Label>
              <p className="mt-6 text-lead leading-snug text-ink">{area.localContext}</p>
            </div>

            <Reveal delay={80}>
              <div>
                <Label>Areas we cover here</Label>
                <ul className="mt-5 border-t border-rule">
                  {area.landmarks.map((landmark) => (
                    <li key={landmark} className="border-b border-rule py-3.5 text-sm text-ink">
                      {landmark}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Most requested */}
      <Section tone="panel2">
        <Container>
          <SectionHeading
            label="Most requested here"
            title={`What ${area.city} calls us for`}
            lead="All six trades are available. These come up most."
          />

          <div className="mt-12 grid gap-px border-y border-rule bg-rule lg:grid-cols-3">
            {featured.map((service, i) => (
              <Reveal key={service.slug} delay={i * 55}>
                <Link
                  href={`/services/${service.slug}`}
                  className="on-dark-hover group flex h-full flex-col justify-between gap-8 bg-panel-2 p-7 transition-colors hover:bg-ink lg:p-9"
                >
                  <div>
                    <h3 className="font-display-tight text-h3 uppercase text-ink transition-colors group-hover:text-panel">
                      {service.name}
                    </h3>
                    <p className="label mt-3.5 text-slate transition-colors group-hover:text-slate">
                      {service.summary}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 self-start bg-ink px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-panel transition-colors group-hover:bg-tape group-hover:text-ink">
                    View
                    <ArrowIcon className="h-3 w-3" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {services
              .filter((s) => !area.emphasis.includes(s.slug))
              .map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="label inline-block border border-rule px-4 py-2.5 text-slate transition-colors hover:border-ink hover:text-ink"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
          </ul>

          <Reveal>
            <div className="mt-12">
              <EmergencyCallout />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Nearby */}
      <Section tone="panel">
        <Container>
          <SectionHeading label="Nearby" title="We also cover" />

          <div className="mt-10 border-t border-rule">
            {nearby.map((other, i) => (
              <Reveal key={other.slug} delay={i * 40}>
                <Link
                  href={`/service-areas/${other.slug}`}
                  className="group flex items-baseline justify-between gap-6 border-b border-rule py-4 transition-colors hover:bg-panel-2"
                >
                  <span className="font-display-tight text-base uppercase text-ink">
                    {other.city}, NC
                  </span>
                  <span className="flex items-baseline gap-6">
                    <span className="label tabular text-slate">{other.driveTime}</span>
                    <ArrowIcon className="shrink-0 self-center text-slate-dim transition-all group-hover:translate-x-1 group-hover:text-ink" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CTABand
        title={`${area.city}. Tell us what's broken.`}
        lead={`Call ${emergencyPhone.display} for anything urgent, or send the equipment details and we arrive prepared.`}
      />
    </>
  );
}
