'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  BadgeCent,
  CheckCircle2,
  ClipboardList,
  Fuel,
  Gauge,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import LoadingIndicator from '@/components/LoadingIndicator';
import ProjectReportPreview from '@/components/reports/ProjectReportPreview';

const PROJECT_SELECT = `
  id,
  name,
  location,
  start_date,
  end_date,
  contractor_name,
  company_name,
  email,
  mobile,
  amount,
  selling_price,
  expected_liters,
  active
`;

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
  generators (
    id,
    name
  ),
  tanks (
    id,
    name
  )
`;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatLitres(value) {
  return `${toNumber(value).toFixed(0)} L`;
}

function formatMoney(value) {
  return `${toNumber(value).toFixed(2)} SAR`;
}

function metricFromTransaction(transaction) {
  const beforeFuel = Number(transaction.before_fuel_level);
  const afterFuel = Number(transaction.after_fuel_level);

  if (!Number.isFinite(beforeFuel) || !Number.isFinite(afterFuel)) {
    return 0;
  }

  return Math.abs(afterFuel - beforeFuel);
}

function MetricCard({ icon: Icon, label, value, hint, tone = 'slate' }) {
  const tones = {
    orange: 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]',
    green: 'bg-[#f3fbef] text-[#2f8f5b] ring-[#d7edce]',
    slate: 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]',
  };

  return (
    <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4 shadow-[0_4px_12px_rgba(98,116,142,0.06)]">
      <span
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ring-1 ${tones[tone]}`}
      >
        <Icon size={20} strokeWidth={2.3} />
      </span>
      <p className="text-xl font-semibold text-[var(--primary-black)]">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#62748e]">{label}</p>
      {hint && <p className="steps-text mt-1">{hint}</p>}
    </div>
  );
}

function TransactionMiniRow({ transaction }) {
  const isDelivery = transaction.type === 'delivery';
  const assetName =
    transaction.generators?.name || transaction.tanks?.name || 'Unassigned';
  const movement = metricFromTransaction(transaction);

  return (
    <li className="flex items-center justify-between gap-3 rounded-[18px] border border-[#e8edf3] bg-white p-3">
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-[var(--primary-black)]">
          {assetName}
        </span>
        <span className="steps-text block">
          {isDelivery ? 'Delivery' : 'Return'}
        </span>
      </span>
      <span
        className={`shrink-0 text-sm font-semibold ${
          isDelivery ? 'text-[#f25822]' : 'text-[#62748e]'
        }`}
      >
        {isDelivery ? '+' : '-'}
        {movement.toFixed(2)} L
      </span>
    </li>
  );
}

export default function ProjectReportPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      setError('');

      const idValue = isNaN(Number(id)) ? id : Number(id);

      const [projectResult, transactionResult] = await Promise.all([
        supabase.from('projects').select(PROJECT_SELECT).eq('id', idValue).single(),
        supabase
          .from('fuel_transactions')
          .select(TRANSACTION_SELECT)
          .eq('project_id', idValue)
          .order('created_at', { ascending: false }),
      ]);

      if (projectResult.error) {
        setError(projectResult.error.message);
        setProject(null);
        setTransactions([]);
      } else if (transactionResult.error) {
        setError(transactionResult.error.message);
        setProject(projectResult.data);
        setTransactions([]);
      } else {
        setProject(projectResult.data);
        setTransactions(transactionResult.data || []);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  const summary = useMemo(() => {
    return transactions.reduce(
      (totals, transaction) => {
        const amount = metricFromTransaction(transaction);

        if (transaction.type === 'return') {
          totals.totalReturnedLitres += amount;
        } else {
          totals.totalDeliveredLitres += amount;
        }

        if (!transaction.after_photo_url || transaction.after_fuel_level === null) {
          totals.pendingEvidence += 1;
        }

        return totals;
      },
      {
        totalDeliveredLitres: 0,
        totalReturnedLitres: 0,
        pendingEvidence: 0,
      }
    );
  }, [transactions]);

  if (loading) return <LoadingIndicator />;

  if (error) {
    return (
      <main className="mx-auto w-full max-w-[760px] px-3 py-4">
        <div className="rounded-[24px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
          Error: {error}
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="mx-auto w-full max-w-[760px] px-3 py-4">
        <div className="rounded-[24px] border border-[#e8edf3] bg-white p-4">
          <p className="steps-text">Project not found.</p>
        </div>
      </main>
    );
  }

  const deliveredLitres = summary.totalDeliveredLitres;
  const returnedLitres = summary.totalReturnedLitres;
  const netUsedLitres = deliveredLitres - returnedLitres;
  const grossMargin =
    netUsedLitres * toNumber(project.selling_price) -
    deliveredLitres * toNumber(project.amount);

  return (
    <main className="mx-auto w-full max-w-[860px] px-3 py-4">
      <Link
        href="/resources/reports/projects"
        className="mb-3 inline-flex h-10 items-center gap-2 rounded-full border border-[#d5eefc] bg-white px-3 text-sm font-semibold text-[#62748e] shadow-sm transition active:scale-[0.98]"
      >
        <ArrowLeft size={16} strokeWidth={2.3} />
        Back
      </Link>

      <div className="mb-3 px-1">
        <p className="page-kicker">Project report</p>
      </div>

      <section className="mb-4 rounded-[28px] border border-[#d9e2ec] bg-gradient-to-br from-white via-[#f8fbff] to-[#d5eefc] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">
              Client report view
            </p>
            <h2 className="mt-2 truncate">
              {project.name || 'Unnamed project'}
            </h2>
            <p className="steps-text mt-1">
              {project.location || 'No location recorded'}
            </p>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              project.active
                ? 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]'
                : 'border-[#e8edf3] bg-white/80 text-[#62748e]'
            }`}
          >
            {project.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </section>

      <section className="background-container-white mb-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="page-kicker">Summary</p>
            <h2 className="mt-1">Fuel and margin</h2>
          </div>
          <ClipboardList className="text-[#62748e]" size={22} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={Fuel}
            label="Delivered"
            value={formatLitres(deliveredLitres)}
            tone="orange"
          />
          <MetricCard
            icon={RotateCcw}
            label="Returned"
            value={formatLitres(returnedLitres)}
          />
          <MetricCard
            icon={Gauge}
            label="Net used"
            value={formatLitres(netUsedLitres)}
            hint="Report fuel basis"
            tone="green"
          />
          <MetricCard
            icon={BadgeCent}
            label="Gross margin"
            value={formatMoney(grossMargin)}
            tone={grossMargin >= 0 ? 'green' : 'slate'}
          />
          <MetricCard
            icon={CheckCircle2}
            label="Transactions"
            value={transactions.length}
          />
          <MetricCard
            icon={ShieldCheck}
            label="Pending evidence"
            value={summary.pendingEvidence}
            tone={summary.pendingEvidence === 0 ? 'green' : 'orange'}
          />
        </div>
      </section>

      <section className="background-container-white mb-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="page-kicker">Report preview</p>
            <h2 className="mt-1">PDF view</h2>
          </div>
        </div>
        <ProjectReportPreview
          project={project}
          summary={summary}
          transactions={transactions}
        />
      </section>

      <section className="background-container-white mb-4">
        <div className="mb-4">
          <p className="page-kicker">Fuel log</p>
          <h2 className="mt-1">Included transactions</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="rounded-[24px] border border-[#e8edf3] bg-white p-4">
            <p className="steps-text">No fuel transactions included yet.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {transactions.slice(0, 8).map((transaction) => (
              <TransactionMiniRow
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
