import type { Metadata } from "next";
import Link from "next/link";

/**
 * Written from what the code actually does, not from a template.
 *
 * Sources of truth, keep in sync if either changes:
 *   - src/components/IntakeForm.tsx      what the form collects
 *   - src/app/api/request-service/route.ts  where it goes, and the rate limiter
 *
 * TODO for the owner: read this and confirm it matches how you really handle
 * customer details, then add a postal address if you want one shown. It is a
 * careful draft, not legal advice.
 */

import { business, fullAddress } from "@/config/business";
import { Container, Section, Label } from "@/components/primitives";
import { PageHero } from "@/components/sections";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${business.name} handles the details you send through this website. What is collected, why, who it reaches, and how to have it deleted.`,
  alternates: { canonical: "/privacy" },
};

/** Keep this current whenever the policy text changes. */
const LAST_UPDATED = "30 August 2026";

function Clause({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule py-8">
      <h2 className="font-display-tight text-h3 uppercase text-ink">{heading}</h2>
      <div className="mt-4 space-y-4 text-[0.975rem] leading-relaxed text-slate">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        label={`Last updated ${LAST_UPDATED}`}
        title="Privacy"
        lead="Short version: we use what you send to schedule and prepare your service call, and for nothing else. We do not sell it, and there are no trackers on this site."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Privacy", href: "/privacy" },
        ]}
      />

      <Section tone="panel">
        <Container>
          <div className="max-w-3xl">
            <Clause heading="What we collect">
              <p>
                Only what you type into the service request form, plus any photographs you choose to
                attach. That is:
              </p>
              <ul className="ml-5 list-disc space-y-1.5">
                <li>Your name, and business name if the job is for a business</li>
                <li>Your phone number, and email address if you give one</li>
                <li>The service address and city</li>
                <li>What needs work, how urgent it is, and your description of the fault</li>
                <li>Equipment make, model and serial number, if you supply them</li>
                <li>Access notes, such as gate codes or where to park</li>
                <li>Photographs you upload, usually of an equipment data plate</li>
              </ul>
              <p>
                You do not need an account, and there is nothing to sign up for. If you would rather
                give none of this to a website, call {business.phoneDisplay} instead.
              </p>
            </Clause>

            <Clause heading="Why we collect it">
              <p>
                To schedule your service call and arrive prepared for it. The equipment details and
                the data plate photograph exist for one reason: so the right part can be sourced
                before the visit rather than after it.
              </p>
              <p>We do not use any of it for marketing, and we do not sell or rent it to anyone.</p>
            </Clause>

            <Clause heading="Where it goes">
              <p>
                Submitting the form sends an email to {business.name}. Photographs travel as
                attachments on that email. If you supply an email address, you also receive a
                confirmation copy.
              </p>
              <p>
                That email is delivered by <strong className="text-ink">Resend</strong>, an email
                service based in the United States. They process the message in order to deliver it.
                They are the only third party that handles your details.
              </p>
              <p>
                <strong className="text-ink">There is no database.</strong> Your request is not
                stored in one, and your photographs are not kept in any cloud storage account. Once
                the email is delivered, the copy that matters is the one in our mailbox.
              </p>
            </Clause>

            <Clause heading="Cookies and tracking">
              <p>
                This website sets <strong className="text-ink">no cookies</strong>. There is no
                analytics, no advertising pixel, no session tracking, and no third-party script
                watching what you do here.
              </p>
              <p>
                If that ever changes, this page changes with it and the date at the top moves.
              </p>
            </Clause>

            <Clause heading="IP addresses">
              <p>
                To stop automated spam, the form briefly holds the IP address a submission came from
                in the server&apos;s memory, along with the time. It is used only to count how many
                requests have arrived from one address in the last ten minutes, and it is discarded
                after that. It is never written to disk, linked to your request, or sent anywhere.
              </p>
            </Clause>

            <Clause heading="How long we keep it">
              <p>
                Service requests live in our email like any other customer correspondence, and are
                kept as long as we need them for the job, the warranty on the work, and our records.
                Photographs are part of that email.
              </p>
            </Clause>

            <Clause heading="Getting your details removed">
              <p>
                Ask, and we will delete them. Call {business.phoneDisplay} or email{" "}
                <a href={`mailto:${business.email}`} className="text-cold underline">
                  {business.email}
                </a>
                , tell us roughly when you contacted us, and we will remove the request and any
                photographs from our mail.
              </p>
              <p>
                You can also ask what we hold about you, and we will tell you. There is no charge
                for either.
              </p>
            </Clause>

            <Clause heading="Children">
              <p>
                This site is for arranging service work and is not directed at children. We do not
                knowingly collect anything from anyone under 13.
              </p>
            </Clause>

            <Clause heading="Links out">
              <p>
                A few links leave this site, such as the map link on the{" "}
                <Link href="/contact" className="text-cold underline">
                  contact page
                </Link>
                . Once you follow one, that company&apos;s privacy policy applies, not this one.
              </p>
            </Clause>

            <Clause heading="Contact">
              <div className="mt-2 border border-rule bg-panel-2 p-6">
                <Label>Who to reach</Label>
                <p className="mt-4 text-ink">{business.name}</p>
                <p className="mt-1">{fullAddress}</p>
                <p className="mt-3">
                  <a href={business.phoneHref} className="font-semibold text-ink hover:text-cold">
                    {business.phoneDisplay}
                  </a>
                </p>
                <p className="mt-1">
                  <a href={`mailto:${business.email}`} className="text-cold underline">
                    {business.email}
                  </a>
                </p>
              </div>
            </Clause>
          </div>
        </Container>
      </Section>
    </>
  );
}
