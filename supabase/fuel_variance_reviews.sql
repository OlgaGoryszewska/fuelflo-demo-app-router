create table if not exists public.fuel_variance_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id bigint not null references public.projects(id) on delete cascade,
  missing_litres numeric,
  note text,
  status text not null default 'open'
    check (status in ('open', 'reviewed', 'resolved')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id)
);

alter table public.fuel_variance_reviews enable row level security;

drop policy if exists "fuel_variance_reviews_read_authenticated" on public.fuel_variance_reviews;
create policy "fuel_variance_reviews_read_authenticated"
  on public.fuel_variance_reviews for select
  to authenticated
  using (true);

drop policy if exists "fuel_variance_reviews_write_operations" on public.fuel_variance_reviews;
create policy "fuel_variance_reviews_write_operations"
  on public.fuel_variance_reviews for all
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('manager', 'hire_desk')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('manager', 'hire_desk')
    )
  );
