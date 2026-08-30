"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { business } from "@/config/business";
import { services } from "@/config/services";
import { PhoneIcon, ArrowIcon } from "./primitives";

const nav = [
  { label: "Commercial", href: "/commercial" },
  { label: "Residential", href: "/residential" },
  { label: "Maintenance", href: "/maintenance-plans" },
  { label: "Areas", href: "/service-areas" },
  { label: "About", href: "/about" },
];

function Wordmark() {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-display text-lg uppercase leading-none text-ink">FMA</span>
      <span aria-hidden className="tape-stripes h-2.5 w-6" />
      <span className="label text-slate">Industries</span>
    </span>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled || open ? "border-b border-rule bg-panel/95 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[82rem] items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" aria-label={`${business.name}, home`}>
          <Wordmark />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link
              href="/services"
              className="label flex items-center gap-1.5 text-slate transition-colors hover:text-ink"
              aria-expanded={servicesOpen}
            >
              Services
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Link>

            {servicesOpen && (
              <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-4">
                <div className="border border-rule bg-panel shadow-[0_20px_48px_-20px_rgba(14,20,23,0.35)]">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="block border-b border-rule px-5 py-3.5 last:border-b-0 hover:bg-panel-2"
                    >
                      <span className="font-display-tight block text-sm uppercase text-ink">
                        {s.name}
                      </span>
                      <span className="label mt-1 block text-slate">{s.summary}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label text-slate transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={business.phoneHref}
            className="hidden items-center gap-2 bg-tape px-5 py-3 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-tape md:inline-flex"
          >
            <PhoneIcon />
            {business.phoneDisplay}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-200 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-6 bg-current transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-200 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="h-[calc(100dvh-4.25rem)] overflow-y-auto bg-panel lg:hidden">
          <nav className="px-5 pb-12" aria-label="Mobile">
            <p className="label py-4 text-slate">Services</p>
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="flex items-baseline justify-between gap-4 border-t border-rule py-4"
              >
                <span className="font-display-tight text-base uppercase text-ink">{s.name}</span>
                <ArrowIcon className="h-3.5 w-3.5 shrink-0 self-center text-slate-dim" />
              </Link>
            ))}

            <p className="label pb-4 pt-9 text-slate">Company</p>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between border-t border-rule py-4"
              >
                <span className="font-display-tight text-base uppercase text-ink">{item.label}</span>
                <ArrowIcon className="h-3.5 w-3.5 text-slate-dim" />
              </Link>
            ))}

            <Link
              href="/request-service"
              className="mt-9 flex items-center justify-center gap-2 bg-tape px-6 py-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink"
            >
              Request service
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
