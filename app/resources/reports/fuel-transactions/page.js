'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Fuel,
  RotateCcw,
  Search,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import LoadingIndicator from '@/components/LoadingIndicator';

const TRANSACTION_SELECT = `
  id,
  project_id,
  generator_id,
  tank_id,
  type,
  status,
  created_at,
  completed_at,
  before_fuel_level,
  after_fuel_level,
  before_photo_url,
  after_photo_url,
  projects (
    id,
    name
  ),
  generators (
    id,
    name
  ),
  tanks (
    id,
    name
  )
`;

function formatDate(dateValue) {
  if (!dateValue) return '-';

  return new Date(dateValue).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function shortId(value) {
  return value ? `${String(value).slice(0, 8)}...` : 'Unassigned';
}

function getMovement(transaction) {
  const beforeFuel = toNumber(transaction.before_fuel_level);
  const afterFuel = toNumber(transaction.after_fuel_level);

  if (beforeFuel === null || afterFuel === null) return null;

  return Math.abs(afterFuel - beforeFuel);
}

function getReportState(transaction) {
  if (!transaction.after_photo_url || toNumber(transaction.after_fuel_level) === null) {
    return {
      label: 'Needs evidence',
      icon: Clock,
      className: 'border-[#fee39f] bg-[#fff7e6] text-[#9a5f12]',
    };
  }

  return {
    label: 'Ready',
    icon: CheckCircle2,
    className: 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]',
  };
}

function TransactionReportRow({ transaction }) {
  const isDelivery = transaction.type === 'delivery';
  const movement = getMovement(transaction);
  const state = getReportState(transaction);
  const StateIcon = state.icon;
  const projectName =
    transaction.projects?.name || shortId(transaction.project_id);
  const assetName =
    transaction.generators?.name ||
    transaction.tanks?.name ||
    shortId(transaction.generator_id || transaction.tank_id);
  const TypeIcon = isDelivery ? Fuel : RotateCcw;

  return (
    <li className="w-full">
      <Link
        href={`/resources/reports/fuel-transactions/${transaction.id}`}
        className="flex items-center gap-3 rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)] transition active:scale-[0.98]"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ${
            isDelivery
              ? 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]'
              : 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]'
          }`}
        >
          <TypeIcon size={21} strokeWidth={2.2} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-[var(--primary-black)]">
            {projectName}
          </span>
          <span className="steps-text mt-1 block truncate">{assetName}</span>
          <span className="steps-text mt-2 block">
            {isDelivery ? 'Delivery' : 'Return'} •{' '}
            {formatDate(transaction.created_at)}
          </span>
        </span>

        <span className="flex shrink-0 flex-col items-end gap-2 text-right">
          <span
            className={`text-base font-semibold ${
              isDelivery ? 'text-[#f25822]' : 'text-[#62748e]'
            }`}
          >
            {movement === null
              ? 'Pending'
              : `${isDelivery ? '+' : '-'}${movement.toFixed(2)} L`}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${state.className}`}
          >
            <StateIcon size={13} strokeWidth={2.4} />
            {state.label}
          </span>
        </span>

        <ArrowRight className="hidden shrink-0 text-[#aab6c3] sm:block" size={17} />
      </Link>
    </li>
  );
}

export default function ReportFuelTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('fuel_transactions')
        .select(TRANSACTION_SELECT)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        setTransactions([]);
      } else {
        setTransactions(data || []);
      }

      setLoading(false);
    }

    load();
  }, []);

  const filteredTransactions = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    if (!searchText) return transactions;

    return transactions.filter((transaction) => {
      const haystack = [
        transaction.id,
        transaction.type,
        transaction.status,
        transaction.projects?.name,
        transaction.generators?.name,
        transaction.tanks?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchText);
    });
  }, [query, transactions]);

  const readyCount = transactions.filter(
    (transaction) => getReportState(transaction).label === 'Ready'
  ).length;

  return (
    <main className="mx-auto w-full max-w-[760px] px-3 py-4">
      <Link
        href="/resources/reports"
        className="mb-3 inline-flex h-10 items-center gap-2 rounded-full border border-[#d5eefc] bg-white px-3 text-sm font-semibold text-[#62748e] shadow-sm transition active:scale-[0.98]"
      >
        <ArrowLeft size={16} strokeWidth={2.3} />
        Back
      </Link>

      <div className="mb-3 px-1">
        <p className="page-kicker">Reports</p>
      </div>

      <section className="background-container-white mb-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="page-kicker">Fuel transaction report</p>
            <h2 className="mt-1">Choose transaction</h2>
            <p className="steps-text mt-1">
              Open a single delivery or return report, then download the PDF.
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff7e6] text-[#f25822] ring-1 ring-[#fee39f]">
            <Fuel size={21} strokeWidth={2.3} />
          </span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-[20px] border border-[#e8edf3] bg-[#f8fbff] p-3">
            <p className="steps-text">Transactions</p>
            <p className="mt-1 text-xl font-semibold text-[var(--primary-black)]">
              {transactions.length}
            </p>
          </div>
          <div className="rounded-[20px] border border-[#e8edf3] bg-[#f3fbef] p-3">
            <p className="steps-text">PDF ready</p>
            <p className="mt-1 text-xl font-semibold text-[#2f8f5b]">
              {readyCount}
            </p>
          </div>
        </div>

        <label className="relative mb-4 block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa8b6]"
            size={18}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search project, asset, status"
            className="pl-10"
          />
        </label>

        {loading && <LoadingIndicator />}

        {error && (
          <div className="rounded-[24px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
            <div className="flex gap-2">
              <AlertTriangle size={18} />
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && filteredTransactions.length === 0 && (
          <div className="rounded-[24px] border border-[#e8edf3] bg-white p-4">
            <p className="text-sm font-semibold text-[var(--primary-black)]">
              No matching transactions.
            </p>
            <p className="steps-text mt-1">
              Try another project name, asset, or status.
            </p>
          </div>
        )}

        {!loading && !error && filteredTransactions.length > 0 && (
          <ul className="flex w-full flex-col gap-2">
            {filteredTransactions.map((transaction) => (
              <TransactionReportRow
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
