import "server-only";

import { getSupabase } from "./supabase";

/**
 * Job request records.
 *
 * Unlike src/lib/settings.ts, nothing here is cached: the inbox must show what
 * actually happened thirty seconds ago, and these routes are already dynamic
 * because they are behind auth. Caching them would be the wrong kind of clever.
 *
 * Every function returns a discriminated result rather than throwing, because
 * the caller that matters most is the public intake route, where an exception
 * would cost a lead.
 */

export const PHOTO_BUCKET = "job-photos";

export type {
  JobRequest,
  JobRequestPhoto,
  JobRequestWithPhotos,
  NewJobRequest,
  RequestStatus,
} from "./jobRequestTypes";
export { STATUSES, STATUS_LABEL } from "./jobRequestTypes";

import type { JobRequest, JobRequestWithPhotos, NewJobRequest } from "./jobRequestTypes";
/** Empty strings from a form are noise in a database. */
const nullIfBlank = (v: string) => (v.trim() === "" ? null : v.trim());

/* -------------------------------------------------------------------------
   Writes
------------------------------------------------------------------------- */

/**
 * Persist a submission. Returns the new id, or null if the database is
 * unavailable.
 *
 * NEVER THROWS. The caller is the public intake route, and a database problem
 * must not stop the notification email going out.
 */
export async function createJobRequest(
  input: NewJobRequest
): Promise<{ id: string } | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("job_requests")
      .insert({
        property_type: nullIfBlank(input.property_type),
        service: nullIfBlank(input.service),
        service_slug: nullIfBlank(input.service_slug),
        urgency: nullIfBlank(input.urgency),
        urgency_label: nullIfBlank(input.urgency_label),
        name: input.name,
        company: nullIfBlank(input.company),
        phone: input.phone,
        email: nullIfBlank(input.email),
        address: input.address,
        city: input.city,
        contact_window: nullIfBlank(input.contact_window),
        symptoms: nullIfBlank(input.symptoms),
        description: nullIfBlank(input.description),
        equipment_make: nullIfBlank(input.equipment_make),
        equipment_model: nullIfBlank(input.equipment_model),
        equipment_serial: nullIfBlank(input.equipment_serial),
        access_notes: nullIfBlank(input.access_notes),
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[job-requests] insert failed:", error);
      return null;
    }
    return { id: data.id as string };
  } catch (error) {
    console.error("[job-requests] insert threw:", error);
    return null;
  }
}

/**
 * Upload one photo and record it. Best-effort: a storage failure loses the
 * photograph, not the request, so it is logged and swallowed.
 */
export async function attachPhoto(
  requestId: string,
  file: { buffer: Buffer; extension: string; contentType: string }
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const path = `${requestId}/${crypto.randomUUID()}${file.extension}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, file.buffer, { contentType: file.contentType, upsert: false });

    if (uploadError) {
      console.error("[job-requests] photo upload failed:", uploadError);
      return false;
    }

    const { error } = await supabase
      .from("job_request_photos")
      .insert({ request_id: requestId, storage_path: path, bytes: file.buffer.byteLength });

    if (error) {
      // The object is orphaned if the row fails. Remove it rather than leave a
      // file nothing points at.
      console.error("[job-requests] photo row failed, removing object:", error);
      await supabase.storage.from(PHOTO_BUCKET).remove([path]);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[job-requests] photo attach threw:", error);
    return false;
  }
}

/** Record whether the notification email got out. Never blocks the response. */
export async function recordEmailResult(
  requestId: string,
  result: { ok: true } | { ok: false; error: string }
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    await supabase
      .from("job_requests")
      .update(
        result.ok
          ? { emailed_at: new Date().toISOString(), email_error: null }
          : { emailed_at: null, email_error: result.error.slice(0, 500) }
      )
      .eq("id", requestId);
  } catch (error) {
    console.error("[job-requests] could not record email result:", error);
  }
}

/* -------------------------------------------------------------------------
   Reads (admin only — callers must have passed requireOperator first)
------------------------------------------------------------------------- */

export async function listJobRequests(): Promise<JobRequest[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("job_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[job-requests] list failed:", error);
    return null;
  }
  return (data ?? []) as JobRequest[];
}

export async function getJobRequest(id: string): Promise<JobRequestWithPhotos | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("job_requests")
    .select("*, job_request_photos(id, storage_path, bytes)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as JobRequestWithPhotos;
}

/** How many other requests share this phone number. */
export async function countPreviousFrom(phone: string, excludeId: string): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("job_requests")
    .select("id", { count: "exact", head: true })
    .eq("phone", phone)
    .neq("id", excludeId);

  if (error) return 0;
  return count ?? 0;
}

/**
 * Short-lived signed URLs for the private bucket. Regenerated on every render
 * rather than stored, so a leaked page source ages out within the hour.
 */
export async function signPhotoUrls(paths: string[]): Promise<Map<string, string>> {
  const urls = new Map<string, string>();
  const supabase = getSupabase();
  if (!supabase || paths.length === 0) return urls;

  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrls(paths, 60 * 60);

  if (error || !data) {
    console.error("[job-requests] could not sign photo urls:", error);
    return urls;
  }

  for (const item of data) {
    if (item.signedUrl && item.path) urls.set(item.path, item.signedUrl);
  }
  return urls;
}

/* -------------------------------------------------------------------------
   Delete
------------------------------------------------------------------------- */

/**
 * Delete a request and everything attached to it.
 *
 * ORDER MATTERS. The foreign key cascade removes the photo ROWS but Storage
 * knows nothing about it, so the objects must go first. Deleting the row first
 * loses the paths and silently orphans customer photographs, which would break
 * the deletion promise in the privacy policy.
 */
export async function deleteJobRequest(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "The database is not connected." };

  try {
    const { data: photos } = await supabase
      .from("job_request_photos")
      .select("storage_path")
      .eq("request_id", id);

    const paths = (photos ?? []).map((p) => p.storage_path as string);
    if (paths.length > 0) {
      const { error: removeError } = await supabase.storage.from(PHOTO_BUCKET).remove(paths);
      if (removeError) {
        // Stop here. A half-delete that leaves photographs behind is worse than
        // no delete, because the record that pointed at them is gone.
        console.error("[job-requests] could not remove photos:", removeError);
        return { ok: false, error: "Could not delete the photos, so nothing was deleted." };
      }
    }

    const { error } = await supabase.from("job_requests").delete().eq("id", id);
    if (error) {
      console.error("[job-requests] delete failed:", error);
      return { ok: false, error: "Could not delete that request." };
    }
    return { ok: true };
  } catch (error) {
    console.error("[job-requests] delete threw:", error);
    return { ok: false, error: "Could not delete that request." };
  }
}
