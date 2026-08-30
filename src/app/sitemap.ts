import type { MetadataRoute } from "next";

import { business } from "@/config/business";
import { services } from "@/config/services";
import { areas } from "@/config/areas";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = business.siteUrl;
  const lastModified = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/commercial", priority: 0.9, changeFrequency: "monthly" },
    { path: "/emergency", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/maintenance-plans", priority: 0.8, changeFrequency: "monthly" },
    { path: "/residential", priority: 0.8, changeFrequency: "monthly" },
    { path: "/request-service", priority: 0.8, changeFrequency: "yearly" },
    { path: "/service-areas", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...services.map((service) => ({
      url: `${base}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...areas.map((area) => ({
      url: `${base}/service-areas/${area.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
