-- Add Stripe-related fields to financial_transactions table for payment processing
-- Run this migration in your Supabase SQL editor

ALTER TABLE financial_transactions 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

ALTER TABLE financial_transactions 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

ALTER TABLE financial_transactions 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' 
CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled'));

ALTER TABLE financial_transactions 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

ALTER TABLE financial_transactions 
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_financial_transactions_stripe_session_id 
ON financial_transactions(stripe_session_id);

CREATE INDEX IF NOT EXISTS idx_financial_transactions_payment_status 
ON financial_transactions(payment_status);