import type { Metadata } from "next";

import { business, emergencyPhone } from "@/config/business";
import { IntakeForm } from "@/components/IntakeForm";
import {
  Container,
  Label,
  SpecRow,
  PhoneIcon,
  MessageIcon,
  ClockIcon,
  CameraIcon,
} from "@/components/primitives";

export const metadata: Metadata = {
  title: "Request Service",
  description:
    "Request HVAC, refrigeration, kitchen equipment, plumbing, electrical or appliance service in Landis, NC. Send a photo of the equipment data plate and we arrive with the right part.",
  alternates: { canonical: "/request-service" },
};

const assurances = [
  {
    icon: CameraIcon,
    title: "Send the data plate",
    body: "A photo of the make, model and serial lets us source parts before the visit. Usually turns two trips into one.",
  },
  {
    icon: ClockIcon,
    title: "About two minutes",
    body: "Four short steps. Only name, phone and address are required.",
  },
  {
    icon: PhoneIcon,
    title: "Emergencies go by phone",
    body: `Down right now? Call ${emergencyPhone.display} and get triaged immediately.`,
  },
];

export default function RequestServicePage() {
  return (
    <div className="grain relative bg-panel pb-20 pt-28 md:pt-36">
      <Container className="relative">
        {/*
          Explicit grid placement keeps the DOM order mobile-first: heading,
          then the form, then supporting detail. On a phone the form is the
          point. Making somebody scroll past a sidebar to reach question one is
          how you lose the request.
        */}
        <div className="grid gap-y-12 lg:grid-cols-[1fr_1.55fr] lg:gap-x-20">
          {/* Heading. Mobile 1st, desktop col 1 row 1. */}
          <div className="lg:col-start-1 lg:row-start-1">
            <Label>Request service</Label>
            <h1 className="font-display mt-6 text-display-sm uppercase text-ink">
              Tell us what&apos;s broken.
            </h1>
            <p className="mt-6 max-w-sm text-lead leading-snug text-slate">
              The more you can tell us up front, the better prepared we arrive.
            </p>
          </div>

          {/* Form. Mobile 2nd, desktop col 2 spanning both rows. */}
          <div className="border border-rule bg-panel-2 p-6 md:p-10 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <IntakeForm />
          </div>

          {/* Supporting detail. Mobile last, desktop col 1 row 2. */}
          <aside className="lg:col-start-1 lg:row-start-2">
            <ul className="space-y-7">
              {assurances.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <item.icon className="mt-1 h-4 w-4 shrink-0 text-slate" />
                  <div>
                    <p className="font-display-tight text-sm uppercase text-ink">{item.title}</p>
                    <p className="mt-1.5 text-sm leading-snug text-slate">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-rule pt-7">
              <Label>Rather just call?</Label>
              <a
                href={business.phoneHref}
                className="font-display mt-4 flex items-center gap-3 text-xl uppercase text-ink transition-colors hover:text-cold"
              >
                <PhoneIcon className="h-4 w-4" />
                {business.phoneDisplay}
              </a>

              {business.smsHref && (
                <a
                  href={business.smsHref}
                  className="mt-3 flex items-center gap-3 text-sm text-slate transition-colors hover:text-ink"
                >
                  <MessageIcon />
                  Or send a text
                </a>
              )}

              <dl className="mt-6">
                <SpecRow k="Mon to Fri" v={business.hours.weekday} />
                <SpecRow k="Saturday" v={business.hours.saturday} />
                {business.emergency.available && <SpecRow k="Emergency" v="24 / 7" />}
              </dl>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
