-- Fuel level forecast alerts for generators and external tanks.
-- Run this in Supabase SQL editor before using the fuel alert review page.

create table if not exists public.fuel_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_key text not null unique,
  project_id bigint references public.projects(id) on delete cascade,
  project_name text,
  asset_type text not null check (asset_type in ('generator', 'tank')),
  asset_id text,
  asset_name text not null,
  risk_level text not null default 'unknown'
    check (risk_level in ('critical', 'urgent', 'warning', 'unknown', 'ok')),
  status text not null default 'open'
    check (status in ('open', 'acknowledged', 'resolved', 'dismissed')),
  title text not null,
  description text,
  current_liters numeric,
  capacity_liters numeric,
  consumption_liters_per_hour numeric,
  hours_until_empty numeric,
  estimated_empty_at timestamptz,
  source_transaction_id uuid references public.fuel_transactions(id) on delete set null,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_fuel_alerts_project_id
on public.fuel_alerts(project_id);

create index if not exists idx_fuel_alerts_status_risk
on public.fuel_alerts(status, risk_level);

create index if not exists idx_fuel_alerts_estimated_empty_at
on public.fuel_alerts(estimated_empty_at);

create or replace function public.set_fuel_alerts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists fuel_alerts_updated_at on public.fuel_alerts;

create trigger fuel_alerts_updated_at
before update on public.fuel_alerts
for each row
execute function public.set_fuel_alerts_updated_at();

alter table public.fuel_alerts enable row level security;

drop policy if exists "Fuel operations users can read alerts"
on public.fuel_alerts;

create policy "Fuel operations users can read alerts"
on public.fuel_alerts
for select
using (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and profile.role = 'hire_desk'
  )
  or exists (
    select 1
    from public.projects project
    where project.id = fuel_alerts.project_id
      and project.manager_id = auth.uid()
  )
  or exists (
    select 1
    from public.profiles_projects assignment
    where assignment.projects_id = fuel_alerts.project_id
      and assignment.profiles_id = auth.uid()
  )
);

drop policy if exists "Fuel operations users can review alerts"
on public.fuel_alerts;

create policy "Fuel operations users can review alerts"
on public.fuel_alerts
for update
using (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and profile.role in ('hire_desk', 'manager', 'technician')
  )
)
with check (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and profile.role in ('hire_desk', 'manager', 'technician')
  )
);
