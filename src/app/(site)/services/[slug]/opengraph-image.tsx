import { services, getService } from "@/config/services";
import { business } from "@/config/business";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = `${business.name} service`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

/** Next 16: `params` is a Promise in image generators and must be awaited. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);

  return renderOgImage({
    eyebrow: service ? service.summary : `${business.address.city}, ${business.address.state}`,
    title: service ? service.name : business.name,
  });
}
