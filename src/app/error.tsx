"use client";

import { useEffect } from "react";

import { business } from "@/config/business";
import { Container, Label, Button, PhoneIcon, ArrowIcon } from "@/components/primitives";

/**
 * Route-level error boundary.
 *
 * Next 16 renamed this prop from `reset` to `retry`. Carries the phone number,
 * because somebody whose walk-in is down does not care that the site broke.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="grain relative flex min-h-[70vh] items-center bg-panel pb-20 pt-36">
      <Container>
        <Label>Something went wrong</Label>

        <h1 className="font-display mt-6 max-w-2xl text-display-sm uppercase text-ink">
          This page didn&apos;t load.
        </h1>

        <p className="mt-6 max-w-md text-lead leading-snug text-slate">
          Our end, not yours. Try again, or just call us. The phone always works.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <a
            href={business.phoneHref}
            className="group inline-flex items-center gap-2.5 whitespace-nowrap bg-tape px-6 py-3.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-tape"
          >
            <PhoneIcon />
            {business.phoneDisplay}
          </a>

          <button
            type="button"
            onClick={retry}
            className="group inline-flex items-center gap-2.5 border border-rule-strong px-6 py-3.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-panel"
          >
            Try again
          </button>

          <Button href="/" variant="outline">
            Back to home
            <ArrowIcon className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {error.digest && (
          <p className="label mt-10 text-slate">Reference {error.digest}</p>
        )}
      </Container>
    </section>
  );
}
