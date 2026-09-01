import Link from "next/link";
import { business, fullAddress, confirmedLicenses } from "@/config/business";
import { getSettings } from "@/lib/settings";
import { services } from "@/config/services";
import { areas } from "@/config/areas";
import { Container, Label, PhoneIcon, MessageIcon } from "./primitives";

const company = [
  { label: "About", href: "/about" },
  { label: "Commercial", href: "/commercial" },
  { label: "Residential", href: "/residential" },
  { label: "Maintenance plans", href: "/maintenance-plans" },
  { label: "Emergency service", href: "/emergency" },
  { label: "Request service", href: "/request-service" },
  { label: "Contact", href: "/contact" },
];

function LinkColumn({
  heading,
  items,
}: {
  heading: string;
  items: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={heading}>
      <Label>{heading}</Label>
      <ul className="mt-5 space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-slate transition-colors hover:text-panel"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export async function Footer() {
  const settings = await getSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark border-t border-rule-dark bg-ink">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <span className="flex items-baseline gap-2">
              <span className="font-display text-xl uppercase leading-none text-panel">FMA</span>
              <span aria-hidden className="tape-stripes h-2.5 w-6" />
              <span className="label text-slate">Industries</span>
            </span>

            <p className="mt-5 max-w-xs text-sm leading-snug text-slate">
              Six trades, one contractor. {business.address.county} and surrounding areas for over{" "}
              {business.yearsExperience} years.
            </p>

            <div className="mt-7 space-y-2.5">
              <a
                href={settings.phoneHref}
                className="font-display-tight flex items-center gap-2.5 text-lg uppercase text-panel transition-colors hover:text-tape"
              >
                <PhoneIcon className="h-4 w-4" />
                {settings.phoneDisplay}
              </a>

              {settings.smsHref && (
                <a
                  href={settings.smsHref}
                  className="flex items-center gap-2.5 text-sm text-slate transition-colors hover:text-panel"
                >
                  <MessageIcon />
                  Text us
                </a>
              )}
            </div>

            <dl className="mt-8 space-y-3 border-t border-rule-dark pt-6">
              <div>
                <dt className="label text-slate">Base</dt>
                <dd className="mt-1 text-sm text-panel">{fullAddress}</dd>
              </div>
              <div>
                <dt className="label text-slate">Hours</dt>
                <dd className="tabular mt-1 text-sm leading-snug text-panel">
                  Mon to Fri {settings.hours.weekday}
                  <br />
                  Sat {settings.hours.saturday}
                </dd>
              </div>
              {settings.emergency.available && (
                <div>
                  <dt className="label text-slate">Emergency</dt>
                  <dd className="mt-1 text-sm text-panel">
                    24/7 · {settings.emergency.display}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <LinkColumn
            heading="Services"
            items={services.map((s) => ({ label: s.name, href: `/services/${s.slug}` }))}
          />

          <LinkColumn
            heading="Service areas"
            items={areas.map((a) => ({ label: `${a.city}, NC`, href: `/service-areas/${a.slug}` }))}
          />

          <div>
            <LinkColumn heading="Company" items={company} />

            <div className="mt-9 border-t border-rule-dark pt-6">
              <Label>Licensed &amp; insured</Label>
              <dl className="mt-5 space-y-3">
                {confirmedLicenses.map((l) => (
                  <div key={l.trade}>
                    <dt className="text-xs leading-snug text-slate">
                      {l.trade}
                      {l.detail ? ` · ${l.detail}` : ""}
                    </dt>
                    <dd className="tabular mt-0.5 font-mono text-xs text-panel">
                      {l.number ? `#${l.number}` : "Number on request"}
                    </dd>
                  </div>
                ))}
                {business.insured && (
                  <div>
                    <dt className="text-xs leading-snug text-slate">General liability</dt>
                    <dd className="mt-0.5 font-mono text-xs text-panel">
                      Certificate on request
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        <div className="label mt-14 flex flex-col gap-3 border-t border-rule-dark pt-7 text-slate sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.legalName}
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              Serving {business.address.city}, {business.address.state} and surrounding communities
            </span>
            <Link href="/privacy" className="underline transition-colors hover:text-panel">
              Privacy
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
