'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import FuelTransactionDetail from '@/components/fuel-transaction/FuelTransactionDetail';
import LoadingIndicator from '@/components/LoadingIndicator';

const TRANSACTION_SELECT = `
  id,
  created_at,
  type,
  status,
  project_id,
  generator_id,
  technician_id,
  completed_at,
  before_fuel_level,
  after_fuel_level,
  before_photo_url,
  after_photo_url,
  tank_id,
  generators (
    id,
    name
  ),
  tanks (
    id,
    name
  ),
  projects (
    id,
    name
  )
`;

export default function ProjectTransactionDetailPage() {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransaction() {
      if (!transactionId) return;

      setLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('fuel_transactions')
        .select(TRANSACTION_SELECT)
        .eq('id', transactionId)
        .single();

      if (error) {
        setErrorMessage(error.message);
        setTransaction(null);
      } else {
        setTransaction(data);
      }

      setLoading(false);
    }

    fetchTransaction();
  }, [transactionId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-3 py-4">
        <div className="rounded-[24px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
          Error: {errorMessage}
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-3 py-4">
        <div className="rounded-[24px] border border-[#e8edf3] bg-white/80 p-4 text-sm text-[var(--primary-mid-gray)]">
          No transaction found.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Transaction details</p>
      </div>

      <FuelTransactionDetail transaction={transaction} />
    </div>
  );
}
