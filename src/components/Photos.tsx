import Image from "next/image";

import { workPhotos, type Photo } from "@/config/photos";
import { Container, Section, SectionHeading } from "./primitives";
import { Reveal } from "./Reveal";

/**
 * Photo slots.
 *
 * Every component here renders `null` when it has no photograph. The site is
 * live and being shown to people before the owner has sent any, so an empty
 * slot has to disappear cleanly rather than leave a grey box behind. When the
 * photos land, nothing needs redesigning: they appear where they were always
 * meant to go.
 *
 * Dimensions are always explicit, so nothing shifts as images load. Formats
 * are AVIF then WebP, configured in next.config.ts.
 */

export function JobPhoto({
  photo,
  priority = false,
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  photo: Photo | null | undefined;
  /** Set only for a photo above the fold. */
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  if (!photo) return null;

  return (
    <figure className={`relative overflow-hidden bg-panel-3 ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover"
      />
      {photo.caption && (
        <figcaption className="label absolute inset-x-0 bottom-0 bg-ink/85 px-4 py-2.5 text-panel">
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Recent work strip. Renders nothing at all until there are photographs,
 * including its heading, so the homepage does not show an empty section.
 */
export function WorkStrip() {
  if (workPhotos.length === 0) return null;

  return (
    <Section tone="panel">
      <Container>
        <SectionHeading
          label="Recent work"
          title="On the job"
          lead="Real equipment, real sites, across Rowan, Cabarrus and Iredell counties."
        />

        <div className="mt-12 grid gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {workPhotos.map((photo, i) => (
            <Reveal key={photo.src} delay={i * 50}>
              <JobPhoto photo={photo} className="aspect-[4/3] w-full" />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
