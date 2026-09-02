"use client";

import { useActionState, useState } from "react";

import { saveTriage, deleteRequest, type ActionState } from "@/app/admin/actions";
import { STATUSES, STATUS_LABEL, type JobRequestWithPhotos } from "@/lib/jobRequestTypes";
import { Fieldset, TextArea } from "@/components/admin/AdminChrome";

/** datetime-local wants "YYYY-MM-DDTHH:mm" in local time, not an ISO string. */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function TriageForm({ request }: { request: JobRequestWithPhotos }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveTriage, {});
  const [deleteState, deleteAction, deleting] = useActionState<ActionState, FormData>(
    deleteRequest,
    {}
  );
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="id" value={request.id} />

        <Fieldset legend="Where it stands">
          <div>
            <span className="label block text-slate">Status</span>
            {/* Radio buttons, not a dropdown: one tap instead of two, and he can
                see every option without opening anything. */}
            <div className="mt-2.5 grid gap-2">
              {STATUSES.map((status) => (
                <label
                  key={status}
                  className="flex min-h-12 cursor-pointer items-center gap-3.5 border border-rule bg-panel px-4"
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    defaultChecked={request.status === status}
                    className="h-5 w-5 shrink-0 accent-[#0e1417]"
                  />
                  <span className="text-sm font-semibold text-ink">{STATUS_LABEL[status]}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="label block text-slate">Booked for</span>
            <span className="mt-1 block text-xs text-slate">Leave blank if not booked yet.</span>
            <input
              type="datetime-local"
              name="scheduled_for"
              defaultValue={toLocalInput(request.scheduled_for)}
              className="mt-2 w-full border border-rule bg-panel px-3.5 py-3 text-base text-ink focus:border-ink focus:outline-none"
            />
          </label>

          <TextArea
            label="Your notes"
            name="internal_notes"
            hint="Only you see these. The customer never does."
            rows={5}
            defaultValue={request.internal_notes ?? ""}
          />
        </Fieldset>

        {state.error && (
          <p className="border border-alarm bg-panel-2 p-4 text-sm text-ink" role="alert">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p className="border border-ink bg-panel-2 p-4 text-sm text-ink" role="status">
            {state.ok}
          </p>
        )}

        <div className="sticky bottom-0 -mx-5 border-t border-rule bg-panel/95 px-5 py-4 backdrop-blur">
          <button
            type="submit"
            disabled={pending}
            className="min-h-12 w-full bg-tape px-6 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-tape disabled:bg-panel-3 disabled:text-slate"
          >
            {pending ? "Saving" : "Save"}
          </button>
        </div>
      </form>

      {/* Deletion is deliberately awkward. It removes the customer's photos from
          storage for good, and it is what makes the privacy policy's deletion
          promise real rather than decorative. */}
      <div className="mt-12 border-t border-rule pt-8">
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="label min-h-11 text-slate underline transition-colors hover:text-alarm"
          >
            Delete this request
          </button>
        ) : (
          <form action={deleteAction} className="border border-alarm bg-panel-2 p-5">
            <input type="hidden" name="id" value={request.id} />
            <p className="text-sm font-semibold text-ink">
              Delete this request and its {request.job_request_photos?.length ?? 0} photo
              {(request.job_request_photos?.length ?? 0) === 1 ? "" : "s"}?
            </p>
            <p className="mt-2 text-sm leading-snug text-slate">
              This cannot be undone. The photographs are removed from storage as well.
            </p>

            <label className="mt-4 block">
              <span className="label block text-slate">Type DELETE to confirm</span>
              <input
                name="confirm"
                autoComplete="off"
                autoCapitalize="characters"
                className="mt-2 w-full border border-rule bg-panel px-3.5 py-3 text-base text-ink focus:border-ink focus:outline-none"
              />
            </label>

            {deleteState.error && (
              <p className="mt-3 text-sm text-ink" role="alert">
                {deleteState.error}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="submit"
                disabled={deleting}
                className="min-h-12 bg-alarm px-6 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {deleting ? "Deleting" : "Delete for good"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="min-h-12 border border-rule-strong px-6 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-panel"
              >
                Keep it
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
