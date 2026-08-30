/**
 * JSON-LD builders.
 *
 * Deliberately omits `aggregateRating` — inventing review counts is a
 * structured-data policy violation. Add it only once real reviews exist.
 */

import { business, fullAddress } from "@/config/business";
import { services, type Service } from "@/config/services";
import { areas, additionalTowns } from "@/config/areas";

const BUSINESS_ID = `${business.siteUrl}/#business`;

export function localBusinessSchema() {
  const sameAs = [business.social.google, business.social.facebook].filter(
    (u): u is string => Boolean(u)
  );

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HVACBusiness"],
    "@id": BUSINESS_ID,
    name: business.name,
    legalName: business.legalName,
    description: business.description,
    url: business.siteUrl,
    telephone: business.phoneDisplay,
    email: business.email,
    foundingDate: String(business.foundedYear),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      ...(business.address.hideStreetAddress
        ? {}
        : { streetAddress: business.address.street, postalCode: business.address.zip }),
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.lat,
      longitude: business.geo.lng,
    },
    openingHoursSpecification: business.openingHours.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: spec.days,
      opens: spec.opens,
      closes: spec.closes,
    })),
    areaServed: [
      ...areas.map((a) => ({
        "@type": "City",
        name: a.city,
        address: { "@type": "PostalAddress", addressRegion: "NC", addressCountry: "US" },
      })),
      ...additionalTowns.map((t) => ({
        "@type": "City",
        name: t,
        address: { "@type": "PostalAddress", addressRegion: "NC", addressCountry: "US" },
      })),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Mechanical Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.summary,
          url: `${business.siteUrl}/services/${s.slug}`,
        },
      })),
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    url: `${business.siteUrl}/services/${service.slug}`,
    serviceType: service.name,
    provider: { "@id": BUSINESS_ID },
    areaServed: areas.map((a) => ({ "@type": "City", name: a.city })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.name}: equipment serviced`,
      itemListElement: service.equipment.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item },
      })),
    },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${business.siteUrl}${item.path}`,
    })),
  };
}

export function areaSchema(cityName: string, county: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `HVAC, Refrigeration & Mechanical Service in ${cityName}, NC`,
    provider: { "@id": BUSINESS_ID },
    areaServed: {
      "@type": "City",
      name: cityName,
      containedInPlace: { "@type": "AdministrativeArea", name: `${county}, North Carolina` },
    },
  };
}

/** Address string reused by the footer and contact page. */
export const schemaAddress = fullAddress;
