-- Add geolocation and integrity metadata for fuel transaction evidence.
-- Run this in Supabase SQL editor after the fuel_transactions table exists.

ALTER TABLE public.fuel_transactions
ADD COLUMN IF NOT EXISTS before_location JSONB;

ALTER TABLE public.fuel_transactions
ADD COLUMN IF NOT EXISTS after_location JSONB;

ALTER TABLE public.fuel_transactions
ADD COLUMN IF NOT EXISTS before_captured_at TIMESTAMPTZ;

ALTER TABLE public.fuel_transactions
ADD COLUMN IF NOT EXISTS after_captured_at TIMESTAMPTZ;

ALTER TABLE public.fuel_transactions
ADD COLUMN IF NOT EXISTS before_photo_sha256 TEXT;

ALTER TABLE public.fuel_transactions
ADD COLUMN IF NOT EXISTS after_photo_sha256 TEXT;

ALTER TABLE public.fuel_transactions
ADD COLUMN IF NOT EXISTS before_capture_context JSONB;

ALTER TABLE public.fuel_transactions
ADD COLUMN IF NOT EXISTS after_capture_context JSONB;

CREATE INDEX IF NOT EXISTS idx_fuel_transactions_before_location
ON public.fuel_transactions USING GIN (before_location);

CREATE INDEX IF NOT EXISTS idx_fuel_transactions_after_location
ON public.fuel_transactions USING GIN (after_location);
