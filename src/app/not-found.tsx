import Link from "next/link";

import { business } from "@/config/business";
import { services } from "@/config/services";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Container, Label, Button, ArrowIcon, PhoneIcon } from "@/components/primitives";
import { getSettings } from "@/lib/settings";

export default async function NotFound() {
  const settings = await getSettings();
  return (
    <section className="grain relative isolate flex min-h-[75vh] items-center overflow-hidden bg-panel pb-20 pt-36">
      <HeroBackdrop />

      <Container className="relative">
        <Label>Error 404</Label>

        <h1 className="font-display mt-6 max-w-2xl text-display-sm uppercase text-ink">
          That page isn&apos;t where it used to be.
        </h1>

        <p className="mt-6 max-w-md text-lead leading-snug text-slate">
          Broken link, moved page, or a typo. If you were after something specific, the phone is
          faster than hunting for it.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Button href={settings.phoneHref} variant="tape">
            <PhoneIcon />
            {settings.phoneDisplay}
          </Button>
          <Button href="/" variant="outline">
            Back to home
            <ArrowIcon className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="mt-14 border-t border-rule pt-8">
          <Label>Or jump to a service</Label>
          <ul className="mt-5 flex flex-wrap gap-2">
            {services.map((service) => (
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
        </div>
      </Container>
    </section>
  );
}
