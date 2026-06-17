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
  image_url text,
  display_order integer default 0,
  published boolean default true,
  updated_at timestamptz default now()
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

create table if not exists public.contact_routing (
  id uuid primary key default gen_random_uuid(),
  enquiry_type text unique not null,
  label text not null,
  recipient_email text not null,
  cc_emails jsonb,
  active boolean default true,
  updated_at timestamptz default now()
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

drop trigger if exists set_committee_members_updated_at on public.committee_members;
create trigger set_committee_members_updated_at
before update on public.committee_members
for each row execute function public.set_updated_at();

drop trigger if exists set_contact_routing_updated_at on public.contact_routing;
create trigger set_contact_routing_updated_at
before update on public.contact_routing
for each row execute function public.set_updated_at();

drop trigger if exists set_membership_applications_updated_at on public.membership_applications;
create trigger set_membership_applications_updated_at
before update on public.membership_applications
for each row execute function public.set_updated_at();

alter table public.site_pages enable row level security;
alter table public.facilities enable row level security;
alter table public.club_events enable row level security;
alter table public.committee_members enable row level security;
alter table public.contact_routing enable row level security;
alter table public.membership_applications enable row level security;

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

drop policy if exists "Public can read published committee members" on public.committee_members;
create policy "Public can read published committee members"
on public.committee_members for select
to anon, authenticated
using (published = true);

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
