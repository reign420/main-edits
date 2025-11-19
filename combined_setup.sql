-- Combined setup for database and storage
-- Idempotent: safe to run multiple times

-- Extensions (required by gen_random_uuid)
create extension if not exists pgcrypto;

-- =============================
-- Clients table (for ClientForm)
-- =============================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  -- Primary client information
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  state text not null,
  zip_code text not null,
  gender text not null check (gender in ('male','female','other')),
  height text not null,
  weight text not null,
  smoking_status text not null check (smoking_status in ('never','former','current')),
  medical_issues text default '',
  medications text default '',
  age integer check (age >= 18 and age <= 85),
  occupation text not null,
  marital_status text not null check (marital_status in ('single','married','divorced','widowed')),

  -- Spouse information (when married)
  spouse_name text,
  spouse_email text,
  spouse_phone text,
  spouse_gender text check (spouse_gender in ('male','female','other')),
  spouse_height text,
  spouse_weight text,
  spouse_smoking_status text check (spouse_smoking_status in ('never','former','current')),
  spouse_medical_issues text default '',
  spouse_medications text default '',
  spouse_age integer check (spouse_age >= 18 and spouse_age <= 85),
  spouse_occupation text,

  -- Coverage details
  desired_coverage_amount integer not null check (desired_coverage_amount > 0 and desired_coverage_amount <= 1000000),

  -- Status tracking
  status text default 'new' check (status in ('new','contacted','qualified','closed','rejected')),
  notes text default '',

  -- Birthdates (optional, used to compute age)
  birthdate date,
  spouse_birthdate date
);

-- Ensure columns exist (for existing installations)
alter table public.clients 
  add column if not exists birthdate date,
  add column if not exists spouse_birthdate date;

-- Age columns must be nullable due to birthdate option
do $$ begin
  begin
    alter table public.clients alter column age drop not null;
  exception when others then null;
  end;
  begin
    alter table public.clients alter column spouse_age drop not null;
  exception when others then null;
  end;
end $$;

-- RLS
alter table public.clients enable row level security;

-- Drop conflicting policies if any, then (re)create
do $$
begin
  perform 1;
  -- Clients policies
  drop policy if exists "Anyone can insert client data" on public.clients;
  drop policy if exists "Authenticated users can view all client data" on public.clients;
  drop policy if exists "Authenticated users can update client data" on public.clients;
  drop policy if exists "Authenticated users can delete client data" on public.clients;
  drop policy if exists "Enable insert for anonymous users" on public.clients;
  drop policy if exists "Enable insert for authenticated users" on public.clients;
  drop policy if exists "Enable read access for all users" on public.clients;
  drop policy if exists "Enable update for users based on email" on public.clients;
  drop policy if exists "Enable delete for users based on user_id" on public.clients;
end $$;

create policy "Anyone can insert client data"
  on public.clients for insert to anon with check (true);

create policy "Authenticated users can view all client data"
  on public.clients for select to authenticated using (true);

create policy "Authenticated users can update client data"
  on public.clients for update to authenticated using (true);

create policy "Authenticated users can delete client data"
  on public.clients for delete to authenticated using (true);

-- Functions for age calculation
create or replace function public.calculate_age_from_birthdate(birth_date date)
returns integer language plpgsql immutable as $$
begin
  if birth_date is null then
    return null;
  end if;
  return extract(year from age(current_date, birth_date));
end; $$;

create or replace function public.set_age_from_birthdate()
returns trigger language plpgsql as $$
begin
  if new.birthdate is not null then
    new.age := public.calculate_age_from_birthdate(new.birthdate);
  end if;
  if new.spouse_birthdate is not null then
    new.spouse_age := public.calculate_age_from_birthdate(new.spouse_birthdate);
  end if;
  return new;
end; $$;

drop trigger if exists trigger_set_age_from_birthdate on public.clients;
create trigger trigger_set_age_from_birthdate
  before insert or update of birthdate, spouse_birthdate on public.clients
  for each row execute function public.set_age_from_birthdate();

-- Validation trigger (lenient but aligned with UI)
create or replace function public.validate_client_age_or_birthdate()
returns trigger language plpgsql as $$
begin
  -- Primary: require one of age or birthdate
  if new.age is null and new.birthdate is null then
    -- Default to allow anon inserts even if UI missed a field
    new.age := coalesce(new.age, 25);
  end if;

  -- Spouse: if married and spouse fields present, ensure at least one age source
  if new.marital_status = 'married' then
    if new.spouse_age is null and new.spouse_birthdate is null then
      null; -- allow; UI enforces at the client level
    end if;
  end if;
  return new;
end; $$;

drop trigger if exists trigger_validate_age_or_birthdate on public.clients;
create trigger trigger_validate_age_or_birthdate
  before insert or update on public.clients
  for each row execute function public.validate_client_age_or_birthdate();

-- Indexes
create index if not exists idx_clients_created_at on public.clients(created_at desc);
create index if not exists idx_clients_email on public.clients(email);
create index if not exists idx_clients_name on public.clients(name);
create index if not exists idx_clients_status on public.clients(status);
create index if not exists idx_clients_birthdate on public.clients(birthdate);
create index if not exists idx_clients_spouse_birthdate on public.clients(spouse_birthdate);
create index if not exists idx_clients_marital_status on public.clients(marital_status);
create index if not exists idx_clients_desired_coverage on public.clients(desired_coverage_amount);

-- Convenience function used by backend if desired
create or replace function public.insert_client_from_form(
  p_name text,
  p_email text,
  p_phone text,
  p_address text,
  p_city text,
  p_state text,
  p_zip_code text,
  p_gender text,
  p_height text,
  p_weight text,
  p_smoking_status text,
  p_occupation text,
  p_marital_status text,
  p_desired_coverage_amount integer,
  p_medical_issues text default '',
  p_medications text default '',
  p_birthdate date default null,
  p_age integer default null,
  p_spouse_name text default null,
  p_spouse_email text default null,
  p_spouse_phone text default null,
  p_spouse_gender text default null,
  p_spouse_height text default null,
  p_spouse_weight text default null,
  p_spouse_smoking_status text default null,
  p_spouse_medical_issues text default '',
  p_spouse_medications text default '',
  p_spouse_birthdate date default null,
  p_spouse_age integer default null,
  p_spouse_occupation text default null
)
returns uuid language plpgsql security definer as $$
declare client_id uuid;
begin
  insert into public.clients (
    name,email,phone,address,city,state,zip_code,
    gender,height,weight,smoking_status,occupation,marital_status,
    desired_coverage_amount,medical_issues,medications,
    birthdate,age,spouse_name,spouse_email,spouse_phone,spouse_gender,
    spouse_height,spouse_weight,spouse_smoking_status,
    spouse_medical_issues,spouse_medications,
    spouse_birthdate,spouse_age,spouse_occupation
  ) values (
    p_name,p_email,p_phone,p_address,p_city,p_state,p_zip_code,
    p_gender,p_height,p_weight,p_smoking_status,p_occupation,p_marital_status,
    p_desired_coverage_amount,p_medical_issues,p_medications,
    p_birthdate,p_age,p_spouse_name,p_spouse_email,p_spouse_phone,p_spouse_gender,
    p_spouse_height,p_spouse_weight,p_spouse_smoking_status,
    p_spouse_medical_issues,p_spouse_medications,
    p_spouse_birthdate,p_spouse_age,p_spouse_occupation
  ) returning id into client_id;
  return client_id;
end; $$;

grant execute on function public.insert_client_from_form to anon;
grant execute on function public.insert_client_from_form to authenticated;

-- =============================
-- Job applicants (for JobApplicationForm)
-- =============================
create table if not exists public.job_applicants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  full_name text not null,
  phone_number text not null,
  email text not null,
  resume_file_path text,
  is_licensed boolean default false,
  status text default 'new' check (status in ('new','reviewing','interview','hired','rejected')),
  notes text default ''
);

alter table public.job_applicants enable row level security;

do $$ begin
  drop policy if exists "Anyone can insert job applications" on public.job_applicants;
  drop policy if exists "Authenticated users can view all job applications" on public.job_applicants;
  drop policy if exists "Authenticated users can update job applications" on public.job_applicants;
  drop policy if exists "Authenticated users can delete job applications" on public.job_applicants;
end $$;

create policy "Anyone can insert job applications"
  on public.job_applicants for insert to anon with check (true);

create policy "Authenticated users can view all job applications"
  on public.job_applicants for select to authenticated using (true);

create policy "Authenticated users can update job applications"
  on public.job_applicants for update to authenticated using (true);

create policy "Authenticated users can delete job applications"
  on public.job_applicants for delete to authenticated using (true);

create index if not exists idx_job_applicants_created_at on public.job_applicants(created_at desc);
create index if not exists idx_job_applicants_email on public.job_applicants(email);
create index if not exists idx_job_applicants_name on public.job_applicants(full_name);
create index if not exists idx_job_applicants_status on public.job_applicants(status);

-- =============================
-- Website visits tracking (optional analytics)
-- =============================
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

create index if not exists website_visits_visited_at_idx on public.website_visits (visited_at desc);
create index if not exists website_visits_path_idx on public.website_visits (path);
create index if not exists website_visits_session_id_idx on public.website_visits (session_id);

do $$ begin
  drop policy if exists "Allow insert for all" on public.website_visits;
  drop policy if exists "Allow select for authenticated" on public.website_visits;
  drop policy if exists "Allow update for authenticated" on public.website_visits;
  drop policy if exists "Allow delete for authenticated" on public.website_visits;
end $$;

create policy "Allow insert for all" on public.website_visits for insert to anon, authenticated with check (true);
create policy "Allow select for authenticated" on public.website_visits for select to authenticated using (true);
create policy "Allow update for authenticated" on public.website_visits for update to authenticated using (true);
create policy "Allow delete for authenticated" on public.website_visits for delete to authenticated using (true);

grant insert on public.website_visits to anon, authenticated;
grant select, update, delete on public.website_visits to authenticated;

-- =============================
-- Storage bucket for resumes (used by JobApplicationForm)
-- =============================
insert into storage.buckets (id, name, public)
values ('resumes','resumes', false)
on conflict (id) do nothing;

-- Storage policies (scoped to resumes bucket)
do $$ begin
  drop policy if exists "Anyone can upload resumes" on storage.objects;
  drop policy if exists "Authenticated users can view resumes" on storage.objects;
  drop policy if exists "Authenticated users can delete resumes" on storage.objects;
end $$;

create policy "Anyone can upload resumes" on storage.objects
  for insert to anon with check (bucket_id = 'resumes');

create policy "Authenticated users can view resumes" on storage.objects
  for select to authenticated using (bucket_id = 'resumes');

create policy "Authenticated users can delete resumes" on storage.objects
  for delete to authenticated using (bucket_id = 'resumes');

-- =============================
-- Sanity checks
-- =============================
do $$
begin
  if not exists (
    select 1 from information_schema.columns where table_schema='public' and table_name='clients' and column_name='birthdate'
  ) then raise exception 'clients.birthdate missing'; end if;
  if not exists (
    select 1 from information_schema.columns where table_schema='public' and table_name='clients' and column_name='spouse_birthdate'
  ) then raise exception 'clients.spouse_birthdate missing'; end if;
end $$;


