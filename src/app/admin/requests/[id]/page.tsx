import Image from "next/image";
import { notFound } from "next/navigation";

import { requireOperator } from "@/lib/auth";
import {
  countPreviousFrom,
  getJobRequest,
  signPhotoUrls,
} from "@/lib/jobRequests";
import { AdminHeader, AdminMain } from "@/components/admin/AdminChrome";
import { Label } from "@/components/primitives";
import { TriageForm } from "./TriageForm";

export const metadata = { title: "Request", robots: { index: false, follow: false } };

/** Only rows with something in them; a screen of "not supplied" helps nobody. */
function Detail({ k, v }: { k: string; v: string | null | undefined }) {
  if (!v) return null;
  return (
    <div className="flex flex-col gap-1 border-b border-rule py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="label text-slate">{k}</dt>
      <dd className="text-sm leading-snug text-ink sm:max-w-[65%] sm:text-right">{v}</dd>
    </div>
  );
}

export default async function RequestDetail(props: PageProps<"/admin/requests/[id]">) {
  await requireOperator();

  const { id } = await props.params;
  const request = await getJobRequest(id);
  if (!request) notFound();

  const photos = request.job_request_photos ?? [];
  const [signed, previous] = await Promise.all([
    signPhotoUrls(photos.map((p) => p.storage_path)),
    countPreviousFrom(request.phone, request.id),
  ]);

  const emergency = request.urgency === "emergency";
  const mapQuery = encodeURIComponent(`${request.address}, ${request.city}, NC`);
  const telHref = `tel:${request.phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      <AdminHeader
        title={request.company || request.name}
        back={{ href: "/admin", label: "Requests" }}
      />

      <AdminMain>
        {emergency && (
          <p className="label mb-4 bg-alarm px-3 py-2 text-white">Marked as an emergency</p>
        )}

        {request.email_error && (
          <div className="mb-6 border border-alarm bg-panel-2 p-4">
            <p className="text-sm font-semibold text-ink">This one never reached your email.</p>
            <p className="mt-1.5 text-sm leading-snug text-slate">
              It is saved here, so nothing is lost. {request.email_error}
            </p>
          </div>
        )}

        {/* The two things he actually does first: ring them, or drive there. */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={telHref}
            className="flex min-h-14 items-center justify-center gap-2 bg-tape px-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-tape"
          >
            Call {request.name.split(" ")[0]}
          </a>
          <a
            href={`https://maps.google.com/?q=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 items-center justify-center gap-2 border border-rule-strong px-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-panel"
          >
            Open in Maps
          </a>
        </div>

        {previous > 0 && (
          <p className="label mt-5 border border-rule bg-panel-2 p-3.5 text-slate">
            {previous} previous {previous === 1 ? "request" : "requests"} from this number
          </p>
        )}

        <section className="mt-8">
          <Label>The job</Label>
          <dl className="mt-4 border-t border-rule">
            <Detail k="Service" v={request.service} />
            <Detail k="Urgency" v={request.urgency_label} />
            <Detail k="Property" v={request.property_type === "business" ? "Business" : request.property_type === "home" ? "Home" : null} />
            <Detail k="Symptoms" v={request.symptoms} />
            <Detail k="Description" v={request.description} />
            <Detail k="Access notes" v={request.access_notes} />
          </dl>
        </section>

        <section className="mt-8">
          <Label>Equipment</Label>
          <dl className="mt-4 border-t border-rule">
            <Detail k="Make" v={request.equipment_make} />
            <Detail k="Model" v={request.equipment_model} />
            <Detail k="Serial" v={request.equipment_serial} />
          </dl>
          {!request.equipment_make && !request.equipment_model && !request.equipment_serial && (
            <p className="border-b border-rule py-3.5 text-sm text-slate">
              Nothing supplied. Check the photos below.
            </p>
          )}
        </section>

        {photos.length > 0 && (
          <section className="mt-8">
            <Label>Data plate photos</Label>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {photos.map((photo) => {
                const url = signed.get(photo.storage_path);
                if (!url) {
                  return (
                    <p key={photo.id} className="label border border-rule p-4 text-slate">
                      Photo unavailable
                    </p>
                  );
                }
                return (
                  <a
                    key={photo.id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-4/3 overflow-hidden border border-rule bg-panel-3"
                  >
                    {/* unoptimized: these are signed URLs that expire, so there is
                        nothing stable for the image optimiser to cache. */}
                    <Image
                      src={url}
                      alt="Equipment data plate supplied by the customer"
                      fill
                      unoptimized
                      sizes="(min-width: 640px) 320px, 45vw"
                      className="object-cover"
                    />
                  </a>
                );
              })}
            </div>
            <p className="label mt-3 text-slate">Tap to open full size. Links expire after an hour.</p>
          </section>
        )}

        <section className="mt-8">
          <Label>Contact</Label>
          <dl className="mt-4 border-t border-rule">
            <Detail k="Name" v={request.name} />
            <Detail k="Business" v={request.company} />
            <Detail k="Phone" v={request.phone} />
            <Detail k="Email" v={request.email} />
            <Detail k="Address" v={`${request.address}, ${request.city}, NC`} />
            <Detail k="Best time" v={request.contact_window} />
            <Detail k="Received" v={new Date(request.created_at).toLocaleString()} />
          </dl>
        </section>

        <section className="mt-10">
          <TriageForm request={request} />
        </section>
      </AdminMain>
    </>
  );
}
