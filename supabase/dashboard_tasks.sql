create table if not exists public.dashboard_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'urgent')),
  status text not null default 'open'
    check (status in ('open', 'done')),
  assigned_to uuid not null references public.profiles(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dashboard_tasks enable row level security;

create or replace function public.set_dashboard_tasks_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists dashboard_tasks_updated_at on public.dashboard_tasks;

create trigger dashboard_tasks_updated_at
before update on public.dashboard_tasks
for each row
execute function public.set_dashboard_tasks_updated_at();

drop policy if exists "Users can read their dashboard tasks"
on public.dashboard_tasks;

create policy "Users can read their dashboard tasks"
on public.dashboard_tasks
for select
using (
  assigned_to = auth.uid()
  or created_by = auth.uid()
);

drop policy if exists "Hire desk and managers can create dashboard tasks"
on public.dashboard_tasks;

create policy "Hire desk and managers can create dashboard tasks"
on public.dashboard_tasks
for insert
with check (
  created_by = auth.uid()
  and (
    exists (
      select 1
      from public.profiles creator
      join public.profiles assignee on assignee.id = assigned_to
      where creator.id = auth.uid()
        and creator.role = 'hire_desk'
        and assignee.role in ('manager', 'technician')
    )
    or exists (
      select 1
      from public.profiles creator
      join public.profiles assignee on assignee.id = assigned_to
      where creator.id = auth.uid()
        and creator.role = 'manager'
        and assignee.role = 'technician'
    )
  )
);

drop policy if exists "Assigned users can complete dashboard tasks"
on public.dashboard_tasks;

create policy "Assigned users can complete dashboard tasks"
on public.dashboard_tasks
for update
using (
  assigned_to = auth.uid()
  or created_by = auth.uid()
)
with check (
  assigned_to = auth.uid()
  or created_by = auth.uid()
);
