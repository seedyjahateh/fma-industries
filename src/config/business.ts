/**
 * SINGLE SOURCE OF TRUTH for every business fact on this site.
 *
 * Nothing in the markup should hardcode a phone number, address, license, or
 * hour. Change it here and it changes everywhere.
 *
 * Anything still marked PLACEHOLDER shows a loud warning banner in `next dev`
 * (see components/PlaceholderWarning.tsx) so it cannot ship by accident.
 */

/** Wrap a value that still needs confirming from the business owner. */
const TODO = <T,>(value: T): T => value;

/** Empty this array as facts get confirmed; the dev warning disappears with it. */
export const PLACEHOLDERS_REMAINING: readonly string[] = [
  "Exact legal/DBA name — is it 'FMA Industries' or 'FMA Industries & Son'?",
  "Phone number (and separate after-hours line, if any)",
  "Whether the phone accepts SMS",
  "Email address",
  "Street address — or confirm he wants service-area-only (no address shown)",
  "Business hours + real after-hours policy (is 24/7 accurate?)",
  "NC license numbers: plumbing/heating, electrical, general contractor",
  "EPA 608 certification level",
  "Insurance carrier + liability limit",
  "Year founded (to confirm '20+ years')",
  "Real job photos — trucks, walk-ins, rooftop units, kitchen lines",
  "Google Business Profile URL once claimed",
  "Domain name",
] as const;

export const business = {
  /** Short name used in nav, logo lockup, and body copy. */
  name: TODO("FMA Industries"),
  /** Full legal name for schema.org and the footer. */
  legalName: TODO("FMA Industries"),
  tagline: "When it breaks, one call.",
  description:
    "Commercial refrigeration, HVAC, kitchen equipment, plumbing, electrical, and appliance repair from one contractor. Serving Landis, NC and the surrounding Rowan, Cabarrus, and Iredell county area for over 20 years.",

  /** 555-01xx is the reserved fictional range — obviously fake, correctly formatted. */
  phoneDisplay: TODO("(704) 555-0142"),
  phoneHref: TODO("tel:+17045550142"),
  /** Set to null if his line is a landline and cannot receive texts. */
  smsHref: TODO<string | null>("sms:+17045550142"),
  email: TODO("service@fmaindustries.com"),

  address: {
    street: TODO("100 S Main St"),
    city: "Landis",
    state: "NC",
    stateFull: "North Carolina",
    zip: TODO("28088"),
    county: "Rowan County",
    /** If true, the street address is hidden publicly (common for owner-operators). */
    hideStreetAddress: TODO(false),
  },

  /** Landis, NC town center. Refine to his actual shop/base if he wants. */
  geo: { lat: 35.5468, lng: -80.6109 },

  hours: {
    weekday: TODO("7:00 AM – 6:00 PM"),
    saturday: TODO("8:00 AM – 2:00 PM"),
    sunday: TODO("Emergency service only"),
  },
  /** schema.org openingHoursSpecification — keep in sync with `hours` above. */
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "18:00" },
    { days: ["Saturday"], opens: "08:00", closes: "14:00" },
  ],

  emergency: {
    available: TODO(true),
    label: "24/7 Emergency Service",
    /** Falls back to the main line when no dedicated after-hours number exists. */
    phoneDisplay: TODO<string | null>(null),
    phoneHref: TODO<string | null>(null),
  },

  yearsExperience: 20,
  foundedYear: TODO(2005),

  /**
   * `number: null` means "held, but the number is not confirmed yet". The UI
   * then shows the trade and "number on request" instead of printing a
   * placeholder, so an unfinished site still reads as finished and honest.
   *
   * Remove any entry he does not actually hold. North Carolina licenses
   * plumbing/heating and electrical through separate boards, and advertising
   * a trade without the licence is a real exposure.
   */
  licenses: TODO<{ trade: string; number: string | null }[]>([
    { trade: "NC Plumbing / Heating Contractor", number: null },
    { trade: "NC Electrical Contractor", number: null },
    { trade: "EPA Section 608 Universal", number: null },
  ]),
  insured: TODO(true),

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

/** Resolve the right number for emergency CTAs without duplicating the fallback. */
export const emergencyPhone = {
  display: business.emergency.phoneDisplay ?? business.phoneDisplay,
  href: business.emergency.phoneHref ?? business.phoneHref,
};

export const fullAddress = business.address.hideStreetAddress
  ? `${business.address.city}, ${business.address.state}`
  : `${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.zip}`;
