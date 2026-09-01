import { business } from "@/config/business";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = `${business.name} — six trades, one contractor. ${business.address.city}, ${business.address.state}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: `${business.address.city}, ${business.address.state} · Commercial & residential`,
    title: "When it breaks, one call.",
  });
}
