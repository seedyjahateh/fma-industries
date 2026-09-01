/**
 * SINGLE SOURCE OF TRUTH for every business fact on this site.
 *
 * Nothing in the markup should hardcode a phone number, address, license, or
 * hour. Change it here and it changes everywhere.
 *
 * Anything still marked PLACEHOLDER shows a loud warning banner in `next dev`
 * (see components/PlaceholderWarning.tsx) so it cannot ship by accident.
 *
 * CONFIRMED BY THE OWNER 30 Aug 2026: legal name, phone, SMS capability, no
 * separate after-hours line, street address, EPA 608 level, and that he carries
 * liability insurance. Everything still wrapped in TODO() below is not.
 */

/** Wrap a value that still needs confirming from the business owner. */
const TODO = <T,>(value: T): T => value;

/** Empty this array as facts get confirmed; the dev warning disappears with it. */
export const PLACEHOLDERS_REMAINING: readonly string[] = [
  "BLOCKER: email address for job requests — owner asked us to create one",
  "BLOCKER: does he hold NC plumbing/heating and electrical contractor licences? (he did not answer)",
  "Licence numbers for any trade he does hold, plus the EPA 608 certificate number",
  "Business hours — the site currently shows assumed hours",
  "Is 24/7 emergency real? The site promises it prominently",
  "Year founded (the hero no longer claims one)",
  "Insurance carrier name",
  "Job photos — owner says they are coming",
  "Exact map coordinates for 900 N Chapel St (currently Landis town centre)",
  "Domain name, then Resend domain verification",
  "Google Business Profile URL once claimed",
] as const;

export const business = {
  /** Confirmed: plain "FMA Industries". The brief's "Son" was a transcription artefact. */
  name: "FMA Industries",
  legalName: "FMA Industries",
  tagline: "When it breaks, one call.",
  description:
    "Commercial refrigeration, HVAC, kitchen equipment, plumbing, electrical, and appliance repair from one contractor. Serving Landis, NC and the surrounding Rowan, Cabarrus, and Iredell county area for over 20 years.",

  /** Confirmed. Same line handles after-hours; he has no separate number. */
  phoneDisplay: "(980) 453-7227",
  phoneHref: "tel:+19804537227",
  /** Confirmed: the line accepts text messages. */
  smsHref: "sms:+19804537227" as string | null,

  /**
   * No address exists yet. The owner asked us to create one, so this stays null
   * and every email row on the site hides itself until it is real. The intake
   * form has nowhere to deliver to until this is set: see
   * app/api/request-service/route.ts, which refuses rather than dropping a lead.
   */
  email: TODO<string | null>(null),

  /** Confirmed. He answered the "address or service-area only" question with an address. */
  address: {
    street: "900 N Chapel St",
    city: "Landis",
    state: "NC",
    stateFull: "North Carolina",
    zip: "28088",
    county: "Rowan County",
    hideStreetAddress: false,
  },

  /**
   * Landis town centre, not the shop. Roughly right, good enough for schema,
   * but set the real pin from the Google Business Profile once it is claimed.
   */
  geo: TODO({ lat: 35.5468, lng: -80.6109 }),

  hours: {
    weekday: TODO("7:00 AM – 6:00 PM"),
    saturday: TODO("8:00 AM – 2:00 PM"),
    sunday: TODO("Emergency service only"),
  },
  /** schema.org openingHoursSpecification — keep in sync with `hours` above. */
  openingHours: TODO([
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "18:00" },
    { days: ["Saturday"], opens: "08:00", closes: "14:00" },
  ]),

  emergency: {
    /** Still an assumption. The site promises this loudly; confirm before launch. */
    available: TODO(true),
    label: "24/7 Emergency Service",
    /** Confirmed: no separate after-hours line, so these stay null and fall back. */
    phoneDisplay: null as string | null,
    phoneHref: null as string | null,
  },

  /** From his own brief ("20th experience"). The exact start year is unknown. */
  yearsExperience: 20,
  foundedYear: TODO<number | null>(null),

  /**
   * `confirmed: false` means we have NOT been told he holds this. Unconfirmed
   * entries are kept here so they are not forgotten, but they are never
   * rendered: claiming a licence he may not hold is the one mistake on this
   * site with real legal consequences.
   *
   * North Carolina licenses plumbing/heating and electrical through separate
   * state boards. He was asked twice and has not answered. Until he does, the
   * plumbing and electrical service pages are the outstanding launch risk.
   *
   * `number: null` means held, but the number is not to hand yet: the UI then
   * shows "Number on request" rather than printing a placeholder.
   */
  licenses: [
    {
      trade: "EPA Section 608 Universal",
      detail: "Types I, II & III",
      number: TODO<string | null>(null),
      confirmed: true,
    },
    {
      trade: "NC Plumbing / Heating Contractor",
      detail: null,
      number: TODO<string | null>(null),
      confirmed: TODO(false),
    },
    {
      trade: "NC Electrical Contractor",
      detail: null,
      number: TODO<string | null>(null),
      confirmed: TODO(false),
    },
  ],

  /**
   * Confirmed that he carries general liability. The figure he gave was a range
   * ("500,000 to 1,000,000"), so no number is published: "certificate available
   * on request" is the standard claim and is true either way.
   */
  insured: true,

  /** Used for canonical URLs, sitemap, and OG images. */
  siteUrl: TODO("https://www.fmaindustries.com"),

  social: {
    google: TODO<string | null>(null),
    facebook: TODO<string | null>(null),
  },
} as const;

/** Equipment brands he services. Trust signal — replace with his real list. */
export const brands = TODO([
  "True",
  "Traulsen",
  "Hoshizaki",
  "Manitowoc",
  "Turbo Air",
  "Beverage-Air",
  "Vulcan",
  "Frymaster",
  "Hobart",
  "Rational",
  "Carrier",
  "Trane",
  "Lennox",
  "Goodman",
  "Rheem",
  "Mitsubishi",
]);

/** Only licences he has actually confirmed reach the page. */
export const confirmedLicenses = business.licenses.filter((l) => l.confirmed);

/** Resolve the right number for emergency CTAs without duplicating the fallback. */
export const emergencyPhone = {
  display: business.emergency.phoneDisplay ?? business.phoneDisplay,
  href: business.emergency.phoneHref ?? business.phoneHref,
};

export const fullAddress = business.address.hideStreetAddress
  ? `${business.address.city}, ${business.address.state}`
  : `${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.zip}`;
