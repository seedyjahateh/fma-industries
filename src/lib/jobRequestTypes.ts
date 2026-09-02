/**
 * Client-safe surface for job requests: types, the status enum, and its labels.
 *
 * This file exists ONLY so that Client Components can use these without
 * dragging in src/lib/jobRequests.ts, which is `server-only` and holds the
 * service-role Supabase client. Importing a runtime value like STATUSES from
 * that module pulls the whole thing into the browser bundle and fails the build.
 *
 * Keep this file free of imports. Anything that touches the database belongs
 * next door.
 */

export const STATUSES = ["new", "scheduled", "in_progress", "done", "cancelled"] as const;
export type RequestStatus = (typeof STATUSES)[number];

/** Shown on status chips. Plain words, not enum names. */
export const STATUS_LABEL: Record<RequestStatus, string> = {
  new: "New",
  scheduled: "Scheduled",
  in_progress: "On the job",
  done: "Done",
  cancelled: "Cancelled",
};

export interface JobRequestPhoto {
  id: string;
  storage_path: string;
  bytes: number | null;
}

export interface JobRequest {
  id: string;
  created_at: string;
  status: RequestStatus;
  scheduled_for: string | null;
  internal_notes: string | null;

  property_type: string | null;
  service: string | null;
  service_slug: string | null;
  urgency: string | null;
  urgency_label: string | null;

  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  contact_window: string | null;

  symptoms: string | null;
  description: string | null;

  equipment_make: string | null;
  equipment_model: string | null;
  equipment_serial: string | null;
  access_notes: string | null;

  emailed_at: string | null;
  email_error: string | null;
}

export interface JobRequestWithPhotos extends JobRequest {
  job_request_photos: JobRequestPhoto[];
}

/** What the intake route hands over. Same shape as the form field names. */
export interface NewJobRequest {
  property_type: string;
  service: string;
  service_slug: string;
  urgency: string;
  urgency_label: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  contact_window: string;
  symptoms: string;
  description: string;
  equipment_make: string;
  equipment_model: string;
  equipment_serial: string;
  access_notes: string;
}
