-- Migration: venue hire + filming applications, and membership approval emails.
-- Safe to run more than once against an existing database.

-- 1. New application tables -------------------------------------------------

create table if not exists public.venue_hire_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  status text not null default 'pending_review',
  payment_status text not null default 'pending',
  admin_notes text,
  email_status text not null default 'not_sent',
  email_error text,
  approval_email_status text not null default 'not_sent',
  approval_email_error text,
  approval_email_sent_at timestamptz,
  name text not null,
  email text not null,
  phone text not null,
  event_type text not null,
  expected_guests integer not null,
  selected_venue text not null,
  submitted_data jsonb not null,
  constraint venue_hire_applications_status_check check (
    status in ('pending_review', 'approved', 'rejected', 'completed')
  ),
  constraint venue_hire_applications_payment_status_check check (
    payment_status in ('not_required', 'pending', 'received')
  ),
  constraint venue_hire_applications_email_status_check check (
    email_status in ('not_sent', 'sent', 'failed')
  ),
  constraint venue_hire_applications_approval_email_status_check check (
    approval_email_status in ('not_sent', 'sent', 'failed', 'skipped')
  )
);

create table if not exists public.filming_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  status text not null default 'pending_review',
  payment_status text not null default 'pending',
  admin_notes text,
  email_status text not null default 'not_sent',
  email_error text,
  approval_email_status text not null default 'not_sent',
  approval_email_error text,
  approval_email_sent_at timestamptz,
  name text not null,
  email text not null,
  phone text not null,
  organization text not null,
  activity_date text not null,
  duration_type text not null,
  location_type text not null,
  submitted_data jsonb not null,
  constraint filming_applications_status_check check (
    status in ('pending_review', 'approved', 'rejected', 'completed')
  ),
  constraint filming_applications_payment_status_check check (
    payment_status in ('not_required', 'pending', 'received')
  ),
  constraint filming_applications_email_status_check check (
    email_status in ('not_sent', 'sent', 'failed')
  ),
  constraint filming_applications_approval_email_status_check check (
    approval_email_status in ('not_sent', 'sent', 'failed', 'skipped')
  )
);

-- 2. Approval email columns on the existing membership table ----------------

alter table public.membership_applications
  add column if not exists approval_email_status text not null default 'not_sent';
alter table public.membership_applications
  add column if not exists approval_email_error text;
alter table public.membership_applications
  add column if not exists approval_email_sent_at timestamptz;

-- The matching CHECK constraint lives inline in the create-table block of
-- cms-schema.sql, so an existing table never receives it. Add it here.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'membership_applications_approval_email_status_check'
      and conrelid = 'public.membership_applications'::regclass
  ) then
    alter table public.membership_applications
      add constraint membership_applications_approval_email_status_check
      check (approval_email_status in ('not_sent', 'sent', 'failed', 'skipped'));
  end if;
end $$;

-- 3. updated_at triggers ----------------------------------------------------

drop trigger if exists set_venue_hire_applications_updated_at on public.venue_hire_applications;
create trigger set_venue_hire_applications_updated_at
before update on public.venue_hire_applications
for each row execute function public.set_updated_at();

drop trigger if exists set_filming_applications_updated_at on public.filming_applications;
create trigger set_filming_applications_updated_at
before update on public.filming_applications
for each row execute function public.set_updated_at();

-- 4. Row level security -----------------------------------------------------

-- No public policies are created for either table: they hold private applicant
-- details. Admin reads/writes go through server-side Next.js route handlers
-- using SUPABASE_SERVICE_ROLE_KEY after Firebase Admin token verification.
alter table public.venue_hire_applications enable row level security;
alter table public.filming_applications enable row level security;
