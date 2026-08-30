"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveal for below-the-fold content.
 *
 * Critically, this renders NOTHING that hides the element on the server. The
 * element ships visible; only after mount — and only once we've measured that
 * it sits below the fold — do we hide it and hand it to an IntersectionObserver.
 *
 * That ordering matters: an earlier version hid elements via a CSS class set by
 * an inline script, which caused a hydration mismatch on <html> and left the
 * entire page invisible. Content must never depend on JS to become visible.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen (or above it) — leave it alone. Animating the hero in
    // after hydration would only delay the largest contentful paint.
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
    el.setAttribute("data-reveal", "");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
