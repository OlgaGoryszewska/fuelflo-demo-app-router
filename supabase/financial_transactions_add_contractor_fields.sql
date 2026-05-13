-- Add contractor metadata fields to financial_transactions for Faktura assignment
-- Run this migration in your Supabase SQL editor

ALTER TABLE financial_transactions
ADD COLUMN IF NOT EXISTS contractor_id TEXT;

ALTER TABLE financial_transactions
ADD COLUMN IF NOT EXISTS contractor_role TEXT
  CHECK (contractor_role IN ('event_organizer', 'fuel_supplier'));

CREATE INDEX IF NOT EXISTS idx_financial_transactions_contractor_id
ON financial_transactions(contractor_id);

CREATE INDEX IF NOT EXISTS idx_financial_transactions_contractor_role
ON financial_transactions(contractor_role);