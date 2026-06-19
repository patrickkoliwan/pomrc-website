create table if not exists public.committee_positions (
  id uuid primary key default gen_random_uuid(),
  title text unique not null,
  display_order integer default 0,
  published boolean default true,
  member_id uuid references public.committee_members(id) on delete set null,
  is_acting boolean default false,
  updated_at timestamptz default now()
);

drop trigger if exists set_committee_positions_updated_at on public.committee_positions;
create trigger set_committee_positions_updated_at
before update on public.committee_positions
for each row execute function public.set_updated_at();

alter table public.committee_positions enable row level security;

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
