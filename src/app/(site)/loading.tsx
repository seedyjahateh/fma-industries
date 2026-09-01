import { Container } from "@/components/primitives";

/**
 * Route-level loading state.
 *
 * Deliberately quiet: bars in the panel palette rather than a spinner, sized to
 * roughly match the hero that replaces them so the swap does not jump. Pages
 * here are static and usually appear instantly, so this should rarely be seen.
 */
export default function Loading() {
  return (
    <div className="grain relative bg-panel pb-16 pt-36 md:pt-44" aria-busy="true">
      <Container>
        <span className="sr-only">Loading</span>

        <div aria-hidden className="animate-pulse">
          <div className="h-3 w-40 bg-panel-3" />
          <div className="mt-7 h-[clamp(2rem,7vw,5rem)] w-full max-w-2xl bg-panel-3" />
          <div className="mt-3 h-[clamp(2rem,7vw,5rem)] w-full max-w-xl bg-panel-3" />
          <div className="mt-8 h-4 w-full max-w-md bg-panel-3" />
          <div className="mt-2.5 h-4 w-full max-w-sm bg-panel-3" />

          <div className="mt-9 flex gap-2.5">
            <div className="h-12 w-44 bg-panel-3" />
            <div className="h-12 w-40 bg-panel-3" />
          </div>
        </div>
      </Container>
    </div>
  );
}
