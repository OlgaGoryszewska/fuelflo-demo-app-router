-- Add creator profile metadata to fuel transactions.
-- Run this in Supabase SQL editor after the fuel_transactions table exists.

ALTER TABLE public.fuel_transactions
ADD COLUMN IF NOT EXISTS created_by UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fuel_transactions_created_by_fkey'
  ) THEN
    ALTER TABLE public.fuel_transactions
    ADD CONSTRAINT fuel_transactions_created_by_fkey
    FOREIGN KEY (created_by)
    REFERENCES public.profiles(id)
    ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_fuel_transactions_created_by
ON public.fuel_transactions(created_by);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fuel_transactions_technician_id_fkey'
  ) THEN
    ALTER TABLE public.fuel_transactions
    ADD CONSTRAINT fuel_transactions_technician_id_fkey
    FOREIGN KEY (technician_id)
    REFERENCES public.profiles(id)
    ON DELETE SET NULL;
  END IF;
END $$;
