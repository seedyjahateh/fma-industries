-- ============================================================================
-- 0002_job_requests
--
-- Turns a service request from "an email that can be buried" into a record with
-- a status he can change from his phone.
--
-- Email remains the notification. This is the record, not the alert: nobody
-- watches a web panel at 2am.
-- ============================================================================

create table if not exists public.job_requests (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Triage. He owns these; the customer never sees them.
  status text not null default 'new'
    check (status in ('new', 'scheduled', 'in_progress', 'done', 'cancelled')),
  scheduled_for  timestamptz,
  internal_notes text,

  -- What the customer submitted. Mirrors the field names in
  -- src/app/api/request-service/route.ts so the mapping stays obvious.
  property_type text,
  service       text,
  service_slug  text,
  urgency       text,
  urgency_label text,

  name           text not null,
  company        text,
  phone          text not null,
  email          text,
  address        text not null,
  city           text not null,
  contact_window text,

  symptoms    text,
  description text,

  equipment_make   text,
  equipment_model  text,
  equipment_serial text,
  access_notes     text,

  -- Delivery state. A lead that never reached his inbox has to be visible in
  -- the panel, otherwise a Resend outage looks exactly like a quiet week.
  emailed_at  timestamptz,
  email_error text
);

comment on column public.job_requests.email_error is
  'Non-null means the notification email failed. The record is still safe.';

create table if not exists public.job_request_photos (
  id         uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.job_requests (id) on delete cascade,
  -- Path inside the private job-photos bucket. NOT a URL: the bucket is
  -- private and the admin mints short-lived signed URLs on demand.
  storage_path text not null,
  bytes        integer,
  created_at   timestamptz not null default now()
);

comment on table public.job_request_photos is
  'Cascade drops these rows with the request, but does NOT delete the objects in '
  'Storage. Delete the objects first: see deleteJobRequest() in src/lib/jobRequests.ts.';

-- Newest first is the only ordering the inbox uses.
create index if not exists job_requests_created_idx on public.job_requests (created_at desc);
create index if not exists job_requests_status_idx  on public.job_requests (status);
-- Powers the repeat-caller count on the detail view: the same walk-in failing
-- twice is worth knowing about before he drives out.
create index if not exists job_requests_phone_idx   on public.job_requests (phone);
create index if not exists job_request_photos_request_idx
  on public.job_request_photos (request_id);

-- ----------------------------------------------------------------------------
-- Row Level Security
--
-- Same posture as 0001: enabled with no policies. Every read and write happens
-- server-side with the service role key, which bypasses RLS. If the anon key
-- ever leaks into client code it reads nothing. This table holds customer
-- names, phone numbers and home addresses, so that matters more here than it
-- did for settings.
-- ----------------------------------------------------------------------------
alter table public.job_requests       enable row level security;
alter table public.job_request_photos enable row level security;
revoke all on public.job_requests       from anon, authenticated;
revoke all on public.job_request_photos from anon, authenticated;

-- ----------------------------------------------------------------------------
-- Storage
--
-- PRIVATE, and it must stay private: these are photographs taken inside
-- customers' premises and kitchens. `public = false` means objects are only
-- reachable through a signed URL minted server-side.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'job-photos',
  'job-photos',
  false,
  8388608, -- 8MB, matching MAX_PHOTO_BYTES in src/lib/resizeImage.ts
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
