create extension if not exists "pgcrypto";

create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  hero_title text,
  hero_subtitle text,
  body jsonb,
  hero_image_url text,
  seo_title text,
  seo_description text,
  published boolean default true,
  updated_at timestamptz default now()
);

create table if not exists public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  description text,
  image_url text,
  features jsonb,
  display_order integer default 0,
  published boolean default true,
  updated_at timestamptz default now()
);

create table if not exists public.club_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  day text,
  event_date date,
  start_time text,
  end_time text,
  price text,
  members_free boolean default false,
  image_url text,
  display_order integer default 0,
  published boolean default true,
  updated_at timestamptz default now()
);

create table if not exists public.junior_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  program_type text not null default 'other',
  description text not null,
  day_text text not null,
  time_text text not null,
  location text not null,
  price text not null,
  image_url text,
  display_order integer default 0,
  published boolean default true,
  updated_at timestamptz default now(),
  constraint junior_programs_program_type_check check (
    program_type in ('tennis', 'squash', 'other')
  )
);

create table if not exists public.junior_program_notice (
  id text primary key default 'primary',
  message text not null default '',
  section text not null default 'tennis',
  enabled boolean default true,
  updated_at timestamptz default now(),
  constraint junior_program_notice_singleton_check check (id = 'primary'),
  constraint junior_program_notice_section_check check (
    section in ('page', 'tennis', 'squash', 'other')
  ),
  constraint junior_program_notice_enabled_message_check check (
    enabled = false or length(btrim(message)) > 0
  )
);

create table if not exists public.committee_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  photo_url text,
  bio text,
  email_alias text,
  display_order integer default 0,
  published boolean default true,
  updated_at timestamptz default now()
);

create table if not exists public.committee_positions (
  id uuid primary key default gen_random_uuid(),
  title text unique not null,
  display_order integer default 0,
  published boolean default true,
  member_id uuid references public.committee_members(id) on delete set null,
  is_acting boolean default false,
  updated_at timestamptz default now()
);

create table if not exists public.contact_routing (
  id uuid primary key default gen_random_uuid(),
  enquiry_type text unique not null,
  label text not null,
  recipient_email text not null,
  cc_emails jsonb,
  active boolean default true,
  updated_at timestamptz default now()
);

create table if not exists public.membership_tiers (
  id text primary key,
  title text not null,
  description text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  annual_amount numeric(10, 2) not null,
  display_order integer default 0,
  active boolean default true,
  updated_at timestamptz default now(),
  constraint membership_tiers_id_check check (
    id in ('FAMILY', 'SINGLE_ADULT', 'JUNIORS', 'SOCIAL')
  )
);

create table if not exists public.membership_prorata_periods (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  start_month integer not null,
  start_day integer not null,
  end_month integer not null,
  end_day integer not null,
  active boolean default true,
  display_order integer default 0,
  updated_at timestamptz default now(),
  constraint membership_prorata_periods_start_month_check check (
    start_month between 1 and 12
  ),
  constraint membership_prorata_periods_end_month_check check (
    end_month between 1 and 12
  ),
  constraint membership_prorata_periods_start_day_check check (
    start_day between 1 and 31
  ),
  constraint membership_prorata_periods_end_day_check check (
    end_day between 1 and 31
  )
);

create table if not exists public.membership_prorata_rates (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references public.membership_prorata_periods(id) on delete cascade,
  tier_id text not null references public.membership_tiers(id) on delete cascade,
  amount numeric(10, 2) not null,
  unique (period_id, tier_id)
);

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  status text not null default 'pending_review',
  payment_status text not null default 'pending',
  admin_notes text,
  email_status text not null default 'not_sent',
  email_error text,
  first_name text not null,
  surname text not null,
  email text not null,
  phone text not null,
  membership_status text not null,
  membership_type text not null,
  submitted_data jsonb not null,
  quoted_amount numeric(10, 2),
  quoted_price_label text,
  pricing_period_id uuid references public.membership_prorata_periods(id) on delete set null,
  constraint membership_applications_status_check check (
    status in ('pending_review', 'approved', 'rejected', 'completed')
  ),
  constraint membership_applications_payment_status_check check (
    payment_status in ('not_required', 'pending', 'received')
  ),
  constraint membership_applications_email_status_check check (
    email_status in ('not_sent', 'sent', 'failed')
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_pages_updated_at on public.site_pages;
create trigger set_site_pages_updated_at
before update on public.site_pages
for each row execute function public.set_updated_at();

drop trigger if exists set_facilities_updated_at on public.facilities;
create trigger set_facilities_updated_at
before update on public.facilities
for each row execute function public.set_updated_at();

drop trigger if exists set_club_events_updated_at on public.club_events;
create trigger set_club_events_updated_at
before update on public.club_events
for each row execute function public.set_updated_at();

drop trigger if exists set_junior_programs_updated_at on public.junior_programs;
create trigger set_junior_programs_updated_at
before update on public.junior_programs
for each row execute function public.set_updated_at();

drop trigger if exists set_junior_program_notice_updated_at on public.junior_program_notice;
create trigger set_junior_program_notice_updated_at
before update on public.junior_program_notice
for each row execute function public.set_updated_at();

drop trigger if exists set_committee_members_updated_at on public.committee_members;
create trigger set_committee_members_updated_at
before update on public.committee_members
for each row execute function public.set_updated_at();

drop trigger if exists set_committee_positions_updated_at on public.committee_positions;
create trigger set_committee_positions_updated_at
before update on public.committee_positions
for each row execute function public.set_updated_at();

drop trigger if exists set_contact_routing_updated_at on public.contact_routing;
create trigger set_contact_routing_updated_at
before update on public.contact_routing
for each row execute function public.set_updated_at();

drop trigger if exists set_membership_applications_updated_at on public.membership_applications;
create trigger set_membership_applications_updated_at
before update on public.membership_applications
for each row execute function public.set_updated_at();

drop trigger if exists set_membership_tiers_updated_at on public.membership_tiers;
create trigger set_membership_tiers_updated_at
before update on public.membership_tiers
for each row execute function public.set_updated_at();

drop trigger if exists set_membership_prorata_periods_updated_at on public.membership_prorata_periods;
create trigger set_membership_prorata_periods_updated_at
before update on public.membership_prorata_periods
for each row execute function public.set_updated_at();

alter table public.site_pages enable row level security;
alter table public.facilities enable row level security;
alter table public.club_events enable row level security;
alter table public.junior_programs enable row level security;
alter table public.junior_program_notice enable row level security;
alter table public.committee_members enable row level security;
alter table public.committee_positions enable row level security;
alter table public.contact_routing enable row level security;
alter table public.membership_applications enable row level security;
alter table public.membership_tiers enable row level security;
alter table public.membership_prorata_periods enable row level security;
alter table public.membership_prorata_rates enable row level security;

drop policy if exists "Public can read published pages" on public.site_pages;
create policy "Public can read published pages"
on public.site_pages for select
to anon, authenticated
using (published = true);

drop policy if exists "Public can read published facilities" on public.facilities;
create policy "Public can read published facilities"
on public.facilities for select
to anon, authenticated
using (published = true);

drop policy if exists "Public can read published events" on public.club_events;
create policy "Public can read published events"
on public.club_events for select
to anon, authenticated
using (published = true);

drop policy if exists "Public can read published junior programs" on public.junior_programs;
create policy "Public can read published junior programs"
on public.junior_programs for select
to anon, authenticated
using (published = true);

drop policy if exists "Public can read enabled junior program notice" on public.junior_program_notice;
create policy "Public can read enabled junior program notice"
on public.junior_program_notice for select
to anon, authenticated
using (enabled = true);

drop policy if exists "Public can read published committee members" on public.committee_members;
create policy "Public can read published committee members"
on public.committee_members for select
to anon, authenticated
using (published = true);

drop policy if exists "Public can read published committee positions" on public.committee_positions;
create policy "Public can read published committee positions"
on public.committee_positions for select
to anon, authenticated
using (published = true and member_id is not null);

insert into public.committee_positions (
  title,
  display_order,
  published,
  member_id,
  is_acting
)
select distinct on (title)
  title,
  display_order,
  published,
  id,
  false
from public.committee_members
order by title, display_order, updated_at desc
on conflict (title) do update set
  display_order = excluded.display_order,
  published = excluded.published,
  member_id = coalesce(public.committee_positions.member_id, excluded.member_id);

-- No insert/update/delete policies are created for anon or authenticated users.
-- No public select policy is created for contact_routing because it stores
-- recipient emails. Public option labels are returned by a server route using
-- SUPABASE_SERVICE_ROLE_KEY.
-- No public policies are created for membership_applications because it stores
-- private applicant details. Admin reads/writes are performed through
-- server-side Next.js route handlers using SUPABASE_SERVICE_ROLE_KEY.
-- Admin writes are performed only through server-side Next.js route handlers
-- using SUPABASE_SERVICE_ROLE_KEY after Firebase Admin token verification.

insert into storage.buckets (id, name, public)
values ('club-media', 'club-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read club media" on storage.objects;
create policy "Public can read club media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'club-media');

-- Uploads are intentionally not allowed for browser clients. The Next.js
-- admin upload route uses the service role key after Firebase admin checks.

alter table public.club_events add column if not exists price text;
alter table public.club_events add column if not exists members_free boolean default false;

alter table public.membership_applications
  add column if not exists quoted_amount numeric(10, 2);
alter table public.membership_applications
  add column if not exists quoted_price_label text;
alter table public.membership_applications
  add column if not exists pricing_period_id uuid references public.membership_prorata_periods(id) on delete set null;

insert into public.membership_tiers (
  id,
  title,
  description,
  highlights,
  annual_amount,
  display_order,
  active
)
values
  (
    'FAMILY',
    'Family',
    'Two adults and children aged 18 and under, or up to 21 if in full-time study.',
    '["2 adults + children under 18", "Up to 21 if in full-time study"]'::jsonb,
    600.00,
    0,
    true
  ),
  (
    'SINGLE_ADULT',
    'Single Adult',
    'For individuals aged 19 years and above.',
    '["For individuals aged 19 and above"]'::jsonb,
    360.00,
    1,
    true
  ),
  (
    'JUNIORS',
    'Junior',
    'For those aged 18 and under, or up to 21 if enrolled in full-time study.',
    '["Aged 18 and under", "Up to 21 if in full-time study"]'::jsonb,
    70.00,
    2,
    true
  ),
  (
    'SOCIAL',
    'Social',
    'All club benefits and amenities; standard non-member court fees apply for court use.',
    '["Full club benefits and amenities", "Non-member court fees apply"]'::jsonb,
    180.00,
    3,
    true
  )
on conflict (id) do nothing;
