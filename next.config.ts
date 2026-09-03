import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * The admin renders job photos from a private Supabase bucket through
 * short-lived signed URLs, so that origin has to be allowed for images.
 * Derived from the env var when it is set; the wildcard is the fallback for a
 * build where it is not, because a silently broken thumbnail on his phone is a
 * worse outcome than a slightly wider image policy.
 */
const supabaseImageOrigin = (() => {
  try {
    return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).origin : "https://*.supabase.co";
  } catch {
    return "https://*.supabase.co";
  }
})();

/**
 * Content Security Policy.
 *
 * `script-src` carries 'unsafe-inline', and that is a deliberate trade rather
 * than an oversight. The alternative is a per-request nonce, which Next can
 * only apply during dynamic rendering: it disables static optimization and ISR
 * outright (see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
 * This site is 50 prerendered pages served from a CDN, and giving that up for a
 * marketing site with no third-party scripts is the wrong way round. The
 * experimental SRI alternative is documented as "may change or be removed",
 * which is not a foundation for a site its owner cannot debug.
 *
 * What 'unsafe-inline' costs: an injected inline <script> would run. What the
 * policy still buys, and what actually matters here: no script can be loaded
 * from another origin, no <base> tag can be injected to reroute relative URLs,
 * no form can post customer details to somebody else's server, and the site
 * cannot be framed for clickjacking.
 *
 * The inline scripts are Next's own hydration payload plus the JSON-LD in
 * src/components/JsonLd.tsx. Nothing here renders user input as HTML: the only
 * customer-supplied text is in the admin, and React escapes it.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${supabaseImageOrigin}`,
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Omitted in development: the dev server is plain http on localhost.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Redundant beside frame-ancestors, kept for browsers that predate it.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    // Nothing here uses any of these. Denying them means an injected script
    // cannot quietly turn one on either.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Two years, and only over https. Sent in production only: a browser that
  // sees this once will refuse plain http for the domain, which would make
  // local development over http://localhost unreachable if it leaked out.
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

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

  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        // robots.txt already disallows /admin, but that is a request not an
        // instruction. This one is honoured even if the panel is linked from
        // somewhere we do not control.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
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
