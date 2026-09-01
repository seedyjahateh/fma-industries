import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

import { business } from "@/config/business";
import { getSettings } from "@/lib/settings";
import { SettingsProvider } from "@/components/SettingsProvider";

/**
 * Root layout: document shell only.
 *
 * The marketing chrome (header, footer, sticky call bar, LocalBusiness JSON-LD)
 * lives in the `(site)` route group instead, so the admin panel does not render
 * inside a sales header with a "Call now" bar over it.
 *
 * Settings are read once here, from a cached read, and shared with Client
 * Components through context. Awaiting a cached function does not make routes
 * dynamic; reading cookies or headers would.
 */

/**
 * Display face is set on Archivo's width axis, not just its weight axis. The
 * expanded cut is what makes the headlines read as engineered signage rather
 * than another grotesque.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

/** Specs, labels, part numbers, temperatures. The spec-sheet voice. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: `${business.name} | HVAC, Refrigeration & Kitchen Service in Landis, NC`,
    template: `%s | ${business.name}`,
  },
  description: business.description,
  applicationName: business.name,
  keywords: [
    "commercial refrigeration repair Landis NC",
    "walk-in cooler repair Rowan County",
    "commercial kitchen equipment repair",
    "HVAC contractor Landis NC",
    "restaurant equipment service Kannapolis",
    "plumbing electrical appliance repair Salisbury NC",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: business.siteUrl,
    siteName: business.name,
    title: `${business.name}. When it breaks, one call.`,
    description: business.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name}. When it breaks, one call.`,
    description: business.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#edeff0",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${instrument.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-panel">
        <SettingsProvider value={settings}>{children}</SettingsProvider>
      </body>
    </html>
  );
}
