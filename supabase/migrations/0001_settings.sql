-- ============================================================================
-- 0001_settings
--
-- One row. It holds the business facts the owner is allowed to change himself,
-- so he stops having to answer questions by text.
--
-- Deliberately NOT in here: anything that is a legal claim. Licences stay in
-- src/config/business.ts under review, because "let him tick a box saying he is
-- a licensed electrician" is exactly the wrong affordance.
-- ============================================================================

create table if not exists public.settings (
  -- Singleton. The check constraint makes a second row impossible rather than
  -- merely unlikely, so reads never have to pick between rows.
  id smallint primary key generated always as identity check (id = 1),

  -- Human-readable opening hours, shown verbatim on the site.
  hours_weekday   text not null default '7:00 AM – 6:00 PM',
  hours_saturday  text not null default '8:00 AM – 2:00 PM',
  hours_sunday    text not null default 'Emergency service only',

  -- Machine-readable equivalent for schema.org openingHoursSpecification.
  -- Kept separate because "Emergency service only" has no opens/closes and the
  -- two forms genuinely differ. Shape:
  --   [{ "days": ["Monday", ...], "opens": "07:00", "closes": "18:00" }]
  opening_hours jsonb not null default
    '[{"days":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"07:00","closes":"18:00"},
      {"days":["Saturday"],"opens":"08:00","closes":"14:00"}]'::jsonb,

  emergency_available boolean not null default true,
  emergency_label     text    not null default '24/7 Emergency Service',

  -- Contact. phone_e164 drives tel:/sms: links; phone_display is what people read.
  phone_display text not null default '(980) 453-7227',
  phone_e164    text not null default '+19804537227',
  sms_enabled   boolean not null default true,
  -- Null until he has an address. The site hides every email row while it is null
  -- and the intake route refuses rather than dropping a lead.
  email         text,

  -- Equipment brands he actually services. Currently a guess in config.
  brands text[] not null default '{}',

  updated_at timestamptz not null default now()
);

-- Seed the single row if it is not there yet.
insert into public.settings (id)
overriding system value
values (1)
on conflict (id) do nothing;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists settings_touch_updated_at on public.settings;
create trigger settings_touch_updated_at
  before update on public.settings
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
--
-- Nothing reaches this table from a browser. The site reads it server-side with
-- the service role key, which bypasses RLS. RLS is enabled with no policies so
-- that if the anon key ever leaks into client code, it reads nothing.
-- ----------------------------------------------------------------------------
alter table public.settings enable row level security;
revoke all on public.settings from anon, authenticated;
