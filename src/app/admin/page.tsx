import Link from "next/link";

import { requireOperator } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/supabase";
import { listJobRequests, STATUS_LABEL, type JobRequest } from "@/lib/jobRequests";
import { AdminHeader, AdminMain } from "@/components/admin/AdminChrome";

export const metadata = { title: "Requests", robots: { index: false, follow: false } };

/** Short, unambiguous on a phone: "Today 14:20", "Tue 9 Sep". */
function when(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  return sameDay
    ? `Today ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
}

function StatusChip({ status }: { status: JobRequest["status"] }) {
  // "new" is the only one that shouts. The rest are quiet so a full inbox does
  // not look like a wall of alarms.
  const style =
    status === "new"
      ? "bg-tape text-ink"
      : status === "cancelled"
        ? "border border-rule text-slate"
        : "border border-ink text-ink";
  return <span className={`label shrink-0 px-2.5 py-1 ${style}`}>{STATUS_LABEL[status]}</span>;
}

function RequestRow({ request }: { request: JobRequest }) {
  const emergency = request.urgency === "emergency";
  const open = request.status !== "done" && request.status !== "cancelled";

  return (
    <li>
      <Link
        href={`/admin/requests/${request.id}`}
        className="flex min-h-16 items-start justify-between gap-4 border-b border-rule py-4 transition-colors hover:bg-panel-2"
      >
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            {emergency && open && (
              <span className="label bg-alarm px-2.5 py-1 text-white">Emergency</span>
            )}
            <span className="font-display-tight truncate text-base uppercase text-ink">
              {request.company || request.name}
            </span>
          </span>

          <span className="label mt-1.5 block text-slate">
            {[request.service, request.city].filter(Boolean).join(" · ")}
          </span>

          {request.email_error && (
            <span className="label mt-1.5 block text-alarm">Email did not send</span>
          )}
        </span>

        <span className="flex shrink-0 flex-col items-end gap-1.5">
          <StatusChip status={request.status} />
          <span className="label text-slate">{when(request.created_at)}</span>
        </span>
      </Link>
    </li>
  );
}

export default async function AdminInbox() {
  await requireOperator();

  const dbReady = isDatabaseConfigured();
  const requests = dbReady ? await listJobRequests() : null;

  // Emergencies that are still open float to the top; everything else stays in
  // arrival order. He should never have to scroll to find the one that matters.
  const sorted = (requests ?? []).slice().sort((a, b) => {
    const urgent = (r: JobRequest) =>
      r.urgency === "emergency" && r.status !== "done" && r.status !== "cancelled" ? 1 : 0;
    return urgent(b) - urgent(a);
  });

  const newCount = sorted.filter((r) => r.status === "new").length;

  return (
    <>
      <AdminHeader title="Requests" />

      <AdminMain>
        {!dbReady && (
          <div className="mb-6 border border-alarm bg-panel-2 p-5">
            <p className="text-sm font-semibold text-ink">The database is not connected yet.</p>
            <p className="mt-2 text-sm leading-snug text-slate">
              Requests still reach you by email, but they are not recorded here until{" "}
              <code className="font-mono text-ink">SUPABASE_URL</code> and{" "}
              <code className="font-mono text-ink">SUPABASE_SERVICE_ROLE_KEY</code> are set.
            </p>
          </div>
        )}

        {dbReady && requests === null && (
          <div className="mb-6 border border-alarm bg-panel-2 p-5">
            <p className="text-sm font-semibold text-ink">Could not load requests.</p>
            <p className="mt-2 text-sm leading-snug text-slate">
              The database did not answer. Your website is unaffected and customers can still
              send requests. Try again shortly.
            </p>
          </div>
        )}

        {sorted.length > 0 && (
          <p className="label mb-2 text-slate">
            {newCount > 0 ? `${newCount} new` : `${sorted.length} total`}
          </p>
        )}

        {sorted.length === 0 ? (
          <p className="border-y border-rule py-10 text-sm text-slate">
            No requests yet. They will appear here as soon as somebody sends one.
          </p>
        ) : (
          <ul className="border-t border-rule">
            {sorted.map((request) => (
              <RequestRow key={request.id} request={request} />
            ))}
          </ul>
        )}

        <nav className="mt-10 border-t border-rule pt-6">
          <Link
            href="/admin/settings"
            className="flex min-h-14 items-center justify-between gap-4 transition-colors hover:text-cold"
          >
            <span>
              <span className="font-display-tight block text-base uppercase text-ink">
                Hours &amp; contact
              </span>
              <span className="mt-1 block text-sm text-slate">
                Opening times, phone, emergency cover, brands
              </span>
            </span>
            <span aria-hidden className="text-slate">
              →
            </span>
          </Link>
        </nav>
      </AdminMain>
    </>
  );
}
