import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCallBar } from "@/components/StickyCallBar";
import { PlaceholderWarning } from "@/components/PlaceholderWarning";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/schema";
import { getSettings } from "@/lib/settings";

/**
 * Marketing chrome. Separate from the root layout so the admin panel is not
 * wrapped in a sales header and a "Call now" bar.
 *
 * Route groups do not affect URLs, so everything under (site) still lives at
 * the same paths it did before.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Hours and phone come from the database, so the schema has to be built per
  // render rather than from the static config.
  const settings = await getSettings();

  return (
    <>
      <JsonLd data={localBusinessSchema(settings)} />

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
    </>
  );
}
