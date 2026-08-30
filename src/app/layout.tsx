import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

import { business } from "@/config/business";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCallBar } from "@/components/StickyCallBar";
import { PlaceholderWarning } from "@/components/PlaceholderWarning";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${instrument.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-panel">
        <JsonLd data={localBusinessSchema()} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-tape focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink"
        >
          Skip to content
        </a>

        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyCallBar />
        <PlaceholderWarning />
      </body>
    </html>
  );
}
