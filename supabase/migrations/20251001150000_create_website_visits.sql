-- Create website_visits table to track anonymous visits without third-party analytics
create table if not exists public.website_visits (
  id uuid primary key default gen_random_uuid(),
  visited_at timestamptz not null default now(),
  path text not null,
  referrer text,
  user_agent text,
  session_id uuid,
  metadata jsonb default '{}'::jsonb
);

alter table public.website_visits enable row level security;

-- Indexes for efficient querying
create index if not exists website_visits_visited_at_idx on public.website_visits (visited_at desc);
create index if not exists website_visits_path_idx on public.website_visits (path);
create index if not exists website_visits_session_id_idx on public.website_visits (session_id);

-- Allow anonymous and authenticated inserts (front-end logging)
create policy "Allow insert for all" on public.website_visits
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated users (admin) can read
create policy "Allow select for authenticated" on public.website_visits
  for select
  to authenticated
  using (true);

-- Allow deletes/updates only to authenticated (e.g., admin tools)
create policy "Allow update for authenticated" on public.website_visits
  for update
  to authenticated
  using (true);

create policy "Allow delete for authenticated" on public.website_visits
  for delete
  to authenticated
  using (true);

-- Grants (optional explicit)
grant insert on public.website_visits to anon, authenticated;
grant select, update, delete on public.website_visits to authenticated;


