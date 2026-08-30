import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The project lives inside the user's home directory, so Turbopack's root
   * inference would otherwise walk up and try to include all of ~. Pin it.
   */
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },

  images: {
    // AVIF first — meaningfully smaller than WebP for the photography
    // that replaces the blueprint backdrops later.
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      // Common guesses people (and old business cards) type.
      { source: "/hvac", destination: "/services/hvac", permanent: true },
      { source: "/refrigeration", destination: "/services/commercial-refrigeration", permanent: true },
      { source: "/plumbing", destination: "/services/plumbing", permanent: true },
      { source: "/electrical", destination: "/services/electrical", permanent: true },
      { source: "/appliances", destination: "/services/appliance-repair", permanent: true },
      { source: "/schedule", destination: "/request-service", permanent: true },
      { source: "/quote", destination: "/request-service", permanent: true },
    ];
  },
};

export default nextConfig;
