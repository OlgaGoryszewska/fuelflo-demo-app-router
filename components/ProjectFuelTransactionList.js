'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import FuelTransactionsList from '@/components/fuel-transaction/fuel-transaction-list.js';
import LoadingIndicator from '@/components/LoadingIndicator';

const TRANSACTION_SELECT = `
  id,
  project_id,
  generator_id,
  type,
  status,
  created_at,
  completed_at,
  before_fuel_level,
  after_fuel_level,
  after_photo_url,
  generators (
    id,
    name
  )
`;

export default function ProjectFuelTransactionsList({ projectId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTransactions = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('fuel_transactions')
      .select(TRANSACTION_SELECT)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setTransactions([]);
    } else {
      setTransactions(data || []);
    }

    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadTransactions, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadTransactions]);

  const enrichedTransactions = transactions.map((transaction) => ({
    ...transaction,
    projects: {
      id: projectId,
      name: 'This project',
    },
  }));

  return (
    <section className="background-container-white mb-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="page-kicker">Fuel log</p>
          <h2 className="mt-1">Project transactions</h2>
          <p className="steps-text mt-1">
            Deliveries, returns, and evidence status for this event.
          </p>
        </div>

        <Link
          href={`/resources/projects/${projectId}/new/`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f25822] text-white shadow-[0_8px_20px_rgba(242,88,34,0.25)] active:scale-[0.96]"
          title="Add fuel transaction"
        >
          <Plus size={22} strokeWidth={2.5} />
        </Link>
      </div>

      {loading && <LoadingIndicator />}

      {error && (
        <div className="rounded-[24px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
          <p>{error}</p>
          <button
            type="button"
            onClick={loadTransactions}
            className="mt-3 inline-flex items-center rounded-full bg-[#f25822] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d94620]"
          >
            Refresh
          </button>
        </div>
      )}

      {!loading && !error && enrichedTransactions.length === 0 && (
        <div className="rounded-[24px] border border-[#e8edf3] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--primary-black)]">
            No fuel transactions yet.
          </p>
          <p className="steps-text mt-1">
            Start with a delivery or return to build the project fuel record.
          </p>
          <Link
            href={`/resources/projects/${projectId}/new/`}
            className="form-button mt-4 justify-center gap-2"
          >
            Add transaction
            <ArrowRight size={18} />
          </Link>
        </div>
      )}

      {!loading && !error && enrichedTransactions.length > 0 && (
        <FuelTransactionsList
          transactions={enrichedTransactions}
          label="Movement"
        />
      )}
    </section>
  );
}
