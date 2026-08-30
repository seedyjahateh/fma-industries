import Link from "next/link";
import type { ComponentProps, ElementType, ReactNode } from "react";

/* =========================================================================
   Motion
========================================================================= */

/**
 * Above-the-fold entrance. Pure CSS keyframes with `backwards` fill, so it
 * runs on first paint with no JavaScript. Use <Reveal> below the fold.
 */
export function Rise({
  children,
  delay = 0,
  fade = true,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  /**
   * Set false for anything that is or could be the largest contentful element.
   * The fading variant holds it at opacity 0 until the animation runs, which
   * delays LCP; the still variant animates position only and paints at once.
   */
  fade?: boolean;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag
      className={`${fade ? "rise" : "rise-still"} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/* =========================================================================
   Layout
========================================================================= */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[82rem] px-5 md:px-10 ${className}`}>{children}</div>
  );
}

const tones = {
  panel: "bg-panel text-ink",
  panel2: "bg-panel-2 text-ink",
  ink: "bg-ink text-panel on-dark",
};

export function Section({
  children,
  className = "",
  id,
  tone = "panel",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: keyof typeof tones;
}) {
  return (
    <section id={id} className={`relative ${tones[tone]} py-18 md:py-28 ${className}`}>
      {children}
    </section>
  );
}

/* =========================================================================
   Type
========================================================================= */

/**
 * Mono micro-label. Carries the spec-sheet voice.
 *
 * No `tone` prop: `text-slate` re-points itself inside `.on-dark`, so the label
 * reads correctly on either ground without being told which one it is on.
 */
export function Label({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`label text-slate ${className}`}>{children}</p>;
}

/**
 * Section headings run tight: a mono label, a short display line, and at most
 * one sentence. Anything longer belongs in a spec block, not a paragraph.
 */
export function SectionHeading({
  label,
  title,
  lead,
  tone = "dark",
  className = "",
}: {
  label?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {label && <Label>{label}</Label>}
      {/* `tone` survives only where the foreground is a hard colour rather than
          a token that flips: the heading is ink or panel, never muted. */}
      <h2
        className={`font-display mt-5 text-h2 uppercase ${
          tone === "light" ? "text-panel" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {lead && <p className="mt-5 max-w-xl text-lead leading-snug text-slate">{lead}</p>}
    </div>
  );
}

/* =========================================================================
   Spec-sheet devices
========================================================================= */

/** A stamped key/value row, as it appears on an equipment data plate. */
export function SpecRow({
  k,
  v,
  tone = "dark",
}: {
  k: string;
  v: ReactNode;
  tone?: "dark" | "light";
}) {
  // `border-rule` and `text-slate` both flip inside `.on-dark`; only the hard
  // foreground colour still needs telling.
  const val = tone === "light" ? "text-panel" : "text-ink";

  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3.5">
      <dt className="label text-slate">{k}</dt>
      <dd className={`tabular text-right text-sm font-medium ${val}`}>{v}</dd>
    </div>
  );
}

/** Big number, mono caption. Used where a figure carries the argument. */
export function Stat({
  value,
  unit,
  caption,
  tone = "dark",
}: {
  value: string;
  unit?: string;
  caption: string;
  tone?: "dark" | "light";
}) {
  return (
    <div>
      <p
        className={`font-display tabular text-3xl uppercase leading-none md:text-4xl ${
          tone === "light" ? "text-panel" : "text-ink"
        }`}
      >
        {value}
        {/* The unit is subordinate, not accented. Safety yellow is a fill in
            this system, never coloured text: on the panel ground it measures
            1.33:1, which is unreadable. */}
        {unit && <span className="text-slate">{unit}</span>}
      </p>
      <p className="label mt-3 text-slate">{caption}</p>
    </div>
  );
}

/* =========================================================================
   Actions

   Safety yellow appears as a filled block with black type on it, the way a
   lockout tag works. It is never used as coloured text.
========================================================================= */

const buttonBase =
  "group inline-flex items-center justify-center gap-2.5 whitespace-nowrap px-6 py-3.5 font-mono text-[0.7rem] font-600 uppercase tracking-[0.12em] transition-colors duration-200";

const variants = {
  tape: "bg-tape text-ink hover:bg-ink hover:text-tape",
  ink: "bg-ink text-panel hover:bg-ink-3",
  outline: "border border-rule-strong text-ink hover:border-ink hover:bg-ink hover:text-panel",
  outlineDark:
    "border border-rule-dark-strong text-panel hover:border-tape hover:bg-tape hover:text-ink",
};

export function Button({
  href,
  variant = "tape",
  className = "",
  children,
  ...rest
}: {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const classes = `${buttonBase} ${variants[variant]} ${className}`;

  // tel:, sms:, and mailto: are not client-side routes
  if (/^(tel:|sms:|mailto:|https?:)/.test(href)) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

/* =========================================================================
   Icons — inline, no icon library
========================================================================= */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PhoneIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function MessageIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function ArrowIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function CheckIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.25} className={className} aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function BoltIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export function PinIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function ClockIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export function ShieldIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  );
}

export function CameraIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function MailIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className} aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="1.5" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}
