'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import FuelTransactionsList from '@/components/fuel-transaction/fuel-transaction-list.js';

const TRANSACTION_SELECT = `
  id,
  type,
  status,
  created_at,
  completed_at,
  project_id,
  generator_id,
  before_fuel_level,
  after_fuel_level,
  after_photo_url,
  generators (
    id,
    name
  ),
  projects (
    id,
    name
  )
`;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getSummary(transactions) {
  return transactions.reduce(
    (summary, transaction) => {
      const beforeFuel = toNumber(transaction.before_fuel_level);
      const afterFuel = toNumber(transaction.after_fuel_level);
      const hasAfterEvidence =
        Boolean(transaction.after_photo_url) && afterFuel !== null;

      if (beforeFuel !== null && afterFuel !== null) {
        summary.totalLitres += Math.abs(afterFuel - beforeFuel);
      }

      if (hasAfterEvidence) {
        summary.complete += 1;
      } else {
        summary.pending += 1;
      }

      return summary;
    },
    {
      complete: 0,
      pending: 0,
      totalLitres: 0,
    }
  );
}

function TypeTabs({ activeType }) {
  const tabs = [
    {
      label: 'Deliveries',
      href: '/resources/fuel-transactions',
      type: 'delivery',
    },
    {
      label: 'Returns',
      href: '/resources/fuel-transactions/returns',
      type: 'return',
    },
  ];

  return (
    <div className="mb-4 grid grid-cols-2 gap-2 rounded-[22px] border border-[#e8edf3] bg-white/70 p-1">
      {tabs.map((tab) => {
        const isActive = tab.type === activeType;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-[18px] px-3 py-2 text-center text-sm font-semibold transition active:scale-[0.98] ${
              isActive
                ? 'bg-[#41516a] text-white shadow-[0_8px_20px_rgba(65,81,106,0.2)]'
                : 'text-[#62748e] active:bg-[#eef4fb]'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

function SummaryTile({ icon: Icon, label, value, tone = 'slate' }) {
  const tones = {
    blue: 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]',
    green: 'bg-[#f3fbef] text-[#2f8f5b] ring-[#d7edce]',
    slate: 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]',
  };

  return (
    <div className="rounded-[20px] border border-[#e8edf3] bg-white/85 p-3">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ring-1 ${tones[tone]}`}
      >
        <Icon size={18} strokeWidth={2.3} />
      </div>
      <p className="text-lg font-semibold text-[var(--primary-black)]">
        {value}
      </p>
      <p className="steps-text mt-1">{label}</p>
    </div>
  );
}

export default function FuelTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('fuel_transactions')
        .select(TRANSACTION_SELECT)
        .eq('type', 'return')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setTransactions(data || []);

      if (!data || data.length === 0) {
        setMessage('No transactions found');
      } else {
        setMessage('');
      }

      setLoading(false);
    }

    load();
  }, []);

  const summary = getSummary(transactions);

  return (
    <div className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Fuel transactions</p>
      </div>

      <div className="background-container">
        <TypeTabs activeType="return" />

        <div className="mb-4">
          <h2>Fuel returns</h2>
          <p className="steps-text mt-1">
            Review fuel coming back from generators and evidence status.
          </p>
        </div>

        {!loading && !error && transactions.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2">
            <SummaryTile
              icon={RotateCcw}
              label="Returned"
              value={`${summary.totalLitres.toFixed(0)} L`}
              tone="blue"
            />
            <SummaryTile
              icon={CheckCircle2}
              label="Complete"
              value={summary.complete}
              tone="green"
            />
            <SummaryTile
              icon={Clock}
              label="Needs after"
              value={summary.pending}
            />
          </div>
        )}

        {loading && (
          <div className="rounded-[24px] border border-[#e8edf3] bg-white p-4">
            <p className="steps-text">Loading transactions...</p>
          </div>
        )}

        {error && (
          <div className="rounded-[24px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
            {error}
          </div>
        )}

        {message && !loading && !error && (
          <div className="rounded-[24px] border border-[#e8edf3] bg-white p-4">
            <p className="text-sm font-semibold text-[var(--primary-black)]">
              No fuel returns recorded yet.
            </p>
            <p className="steps-text mt-1">{message}</p>
          </div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <FuelTransactionsList transactions={transactions} type="return" />
        )}
      </div>
    </div>
  );
}
