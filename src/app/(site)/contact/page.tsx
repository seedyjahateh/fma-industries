import type { Metadata } from "next";
import Link from "next/link";

import { business, fullAddress, emergencyPhone } from "@/config/business";
import { areas, counties } from "@/config/areas";
import { Reveal } from "@/components/Reveal";
import {
  Container,
  Section,
  Label,
  SectionHeading,
  Button,
  SpecRow,
  ArrowIcon,
  PhoneIcon,
  MessageIcon,
  MailIcon,
  PinIcon,
  BoltIcon,
} from "@/components/primitives";
import { PageHero, CapabilityRail } from "@/components/sections";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${business.name} in ${business.address.city}, NC for HVAC, refrigeration, kitchen equipment, plumbing, electrical and appliance service. Call ${business.phoneDisplay}.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();
  const mapQuery = encodeURIComponent(
    `${business.address.city}, ${business.address.state} ${
      business.address.hideStreetAddress ? "" : business.address.zip
    }`
  );

  return (
    <>
      <PageHero
        label="Get in touch"
        title="Call, text, or send the details."
        lead="The phone is fastest for anything urgent. The request form is better when you can send equipment details and a photo of the data plate."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <CapabilityRail />

      <Section tone="panel">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            {/* Direct */}
            <div>
              <SectionHeading label="Direct" title="How to reach us" />

              <div className="mt-10 border-t border-rule">
                <a
                  href={settings.phoneHref}
                  className="group flex items-center gap-5 border-b border-rule py-6"
                >
                  <PhoneIcon className="h-5 w-5 shrink-0 text-slate" />
                  <span>
                    <span className="label block text-slate">Phone</span>
                    <span className="font-display mt-1.5 block text-xl uppercase text-ink transition-colors group-hover:text-cold sm:text-2xl">
                      {settings.phoneDisplay}
                    </span>
                  </span>
                </a>

                {settings.smsHref && (
                  <a
                    href={settings.smsHref}
                    className="group flex items-center gap-5 border-b border-rule py-6"
                  >
                    <MessageIcon className="h-5 w-5 shrink-0 text-slate" />
                    <span>
                      <span className="label block text-slate">Text</span>
                      <span className="mt-1.5 block text-base font-medium text-ink transition-colors group-hover:text-cold">
                        Send us a message
                      </span>
                    </span>
                  </a>
                )}

                {/* Hidden until a real address exists. Better no email row than
                    one that bounces. */}
                {settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="group flex items-center gap-5 border-b border-rule py-6"
                  >
                    <MailIcon className="h-5 w-5 shrink-0 text-slate" />
                    <span>
                      <span className="label block text-slate">Email</span>
                      <span className="mt-1.5 block text-base font-medium text-ink transition-colors group-hover:text-cold">
                        {settings.email}
                      </span>
                    </span>
                  </a>
                )}

                <div className="flex items-start gap-5 border-b border-rule py-6">
                  <PinIcon className="mt-1 h-5 w-5 shrink-0 text-slate" />
                  <span>
                    <span className="label block text-slate">Based in</span>
                    <span className="mt-1.5 block text-base font-medium text-ink">
                      {fullAddress}
                    </span>
                    <a
                      href={`https://maps.google.com/?q=${mapQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-sm text-cold hover:underline"
                    >
                      Open in Maps
                      <ArrowIcon className="h-3 w-3" />
                    </a>
                  </span>
                </div>
              </div>

              <div className="mt-10">
                <Label>Hours</Label>
                <dl className="mt-4">
                  <SpecRow k="Mon to Fri" v={settings.hours.weekday} />
                  <SpecRow k="Saturday" v={settings.hours.saturday} />
                  <SpecRow k="Sunday" v={settings.hours.sunday} />
                </dl>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-7">
              <Reveal>
                <div className="border border-rule bg-panel-2 p-7 lg:p-9">
                  <Label>Best for scheduled work</Label>
                  <h2 className="font-display-tight mt-5 text-h3 uppercase text-ink">
                    Send us the details
                  </h2>
                  <p className="mt-3.5 text-sm leading-snug text-slate">
                    Four short steps, about two minutes. Include the make, model and a photo of the
                    data plate and we source the right part before coming out.
                  </p>
                  <div className="mt-7">
                    <Button href="/request-service" variant="tape">
                      Request service
                      <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </Reveal>

              {settings.emergency.available && (
                <Reveal delay={80}>
                  <div className="border border-ink bg-panel">
                    <div className="tape-stripes h-2" aria-hidden />
                    <div className="p-7 lg:p-9">
                      <Label className="flex items-center gap-2">
                        <BoltIcon className="h-3 w-3" />
                        {settings.emergency.label}
                      </Label>
                      <h2 className="font-display-tight mt-5 text-h3 uppercase text-ink">
                        Something down right now?
                      </h2>
                      <p className="mt-3.5 text-sm leading-snug text-slate">
                        Call. Emergencies are triaged by phone. Nobody watches an inbox at 2am.
                      </p>
                      <div className="mt-7">
                        <Button href={settings.emergency.href} variant="tape">
                          <PhoneIcon />
                          {settings.emergency.display}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )}

              <Reveal delay={130}>
                <div className="border border-rule p-7 lg:p-9">
                  <Label>Service area</Label>
                  <p className="mt-4 text-sm leading-snug text-slate">
                    {counties.slice(0, -1).join(", ")} and {counties.at(-1)} counties. Roughly a 30
                    mile radius from {business.address.city}.
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {areas.map((area) => (
                      <li key={area.slug}>
                        <Link
                          href={`/service-areas/${area.slug}`}
                          className="label inline-block border border-rule px-3 py-2 text-slate transition-colors hover:border-ink hover:text-ink"
                        >
                          {area.city}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
