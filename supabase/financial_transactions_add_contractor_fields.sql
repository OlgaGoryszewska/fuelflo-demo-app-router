-- Add contractor metadata fields to financial_transactions for Faktura assignment
-- Run this migration in your Supabase SQL editor

ALTER TABLE financial_transactions
ADD COLUMN IF NOT EXISTS contractor_id UUID;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'financial_transactions'
      AND column_name = 'contractor_id'
      AND data_type <> 'uuid'
  ) THEN
    ALTER TABLE public.financial_transactions
    ALTER COLUMN contractor_id TYPE uuid
    USING NULLIF(contractor_id, '')::uuid;
  END IF;
END $$;

ALTER TABLE financial_transactions
ADD COLUMN IF NOT EXISTS contractor_role TEXT
  CHECK (contractor_role IN ('event_organizer', 'fuel_supplier'));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'financial_transactions_contractor_id_fkey'
  ) THEN
    ALTER TABLE public.financial_transactions
    ADD CONSTRAINT financial_transactions_contractor_id_fkey
    FOREIGN KEY (contractor_id)
    REFERENCES public.profiles(id)
    ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_financial_transactions_contractor_id
ON financial_transactions(contractor_id);

CREATE INDEX IF NOT EXISTS idx_financial_transactions_contractor_role
ON financial_transactions(contractor_role);
