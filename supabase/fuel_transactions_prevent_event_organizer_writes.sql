-- Prevent event organizers from creating or completing fuel transactions.
-- Run this in Supabase SQL editor to enforce the rule at database level.

create or replace function public.prevent_event_organizer_fuel_transaction_writes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_role text;
begin
  select role
  into current_role
  from public.profiles
  where id = auth.uid();

  if current_role = 'event_organizer' then
    raise exception 'Event organizers cannot create or update fuel transactions.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_event_organizer_fuel_transaction_inserts
on public.fuel_transactions;

create trigger prevent_event_organizer_fuel_transaction_inserts
before insert on public.fuel_transactions
for each row
execute function public.prevent_event_organizer_fuel_transaction_writes();

drop trigger if exists prevent_event_organizer_fuel_transaction_updates
on public.fuel_transactions;

create trigger prevent_event_organizer_fuel_transaction_updates
before update on public.fuel_transactions
for each row
execute function public.prevent_event_organizer_fuel_transaction_writes();
