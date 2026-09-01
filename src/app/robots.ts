import type { MetadataRoute } from "next";
import { business } from "@/config/business";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin is also noindex'd in its layout metadata; robots.txt is a
      // request, not enforcement, so both are set.
      disallow: ["/api/", "/admin"],
    },
    sitemap: `${business.siteUrl}/sitemap.xml`,
    host: business.siteUrl,
  };
}
