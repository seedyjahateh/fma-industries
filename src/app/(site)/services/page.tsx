import type { Metadata } from "next";

import { PageHero, ServiceGrid, BrandStrip, CTABand, CapabilityRail } from "@/components/sections";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six trades under one contractor: commercial refrigeration, kitchen equipment, HVAC, plumbing, electrical and appliance repair across Landis, NC and Rowan, Cabarrus and Iredell counties.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Capability"
        title="Six trades. One contractor."
        lead="All of it in-house. That is what lets us follow a fault from the equipment to the circuit to the gas line without handing you off."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
      />

      <CapabilityRail />

      <ServiceGrid
        label="All services"
        heading="What we service"
        lead="Commercial and residential. Repair, replacement and planned maintenance."
      />

      <BrandStrip />
      <CTABand />
    </>
  );
}
