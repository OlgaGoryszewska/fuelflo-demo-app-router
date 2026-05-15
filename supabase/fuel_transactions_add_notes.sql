alter table public.fuel_transactions
  add column if not exists operator_note text,
  add column if not exists after_note text,
  add column if not exists review_note text;
