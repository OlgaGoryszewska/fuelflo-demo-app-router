-- Allow assigned contractor profiles to receive/read fakturas made for them.
-- Run this in Supabase SQL editor after the financial_transactions table exists.

ALTER TABLE public.financial_transactions
ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Assigned contractors can read their fakturas"
ON public.financial_transactions;

CREATE POLICY "Assigned contractors can read their fakturas"
ON public.financial_transactions
FOR SELECT
USING (
  contractor_id = auth.uid()
);

DROP POLICY IF EXISTS "Creators can read financial transactions"
ON public.financial_transactions;

CREATE POLICY "Creators can read financial transactions"
ON public.financial_transactions
FOR SELECT
USING (
  created_by = auth.uid()
);

DROP POLICY IF EXISTS "Finance staff can read financial transactions"
ON public.financial_transactions;

CREATE POLICY "Finance staff can read financial transactions"
ON public.financial_transactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('manager', 'hire_desk')
  )
);

DROP POLICY IF EXISTS "Creators can update financial transactions"
ON public.financial_transactions;

CREATE POLICY "Creators can update financial transactions"
ON public.financial_transactions
FOR UPDATE
USING (
  created_by = auth.uid()
)
WITH CHECK (
  created_by = auth.uid()
);

DROP POLICY IF EXISTS "Finance staff can update financial transactions"
ON public.financial_transactions;

CREATE POLICY "Finance staff can update financial transactions"
ON public.financial_transactions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('manager', 'hire_desk')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('manager', 'hire_desk')
  )
);
