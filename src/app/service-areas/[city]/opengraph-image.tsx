import { areas, getArea } from "@/config/areas";
import { business } from "@/config/business";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = `${business.name} service area`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return areas.map((area) => ({ city: area.slug }));
}

/** Next 16: `params` is a Promise in image generators and must be awaited. */
export default async function Image({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const area = getArea(city);

  return renderOgImage({
    eyebrow: area ? `${area.county} · ${area.driveTime}` : "Service area",
    title: area ? `Service in ${area.city}, NC` : business.name,
  });
}
