'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Fuel,
  MapPin,
  PiggyBank,
  RotateCcw,
  TimerReset,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import formatDateShort from '@/components/FormatDateShort';

const PROJECT_SELECT = 'id, name, location, start_date, active';

const TRANSACTION_SELECT = `
  id,
  type,
  created_at,
  project_id,
  generator_id,
  before_fuel_level,
  after_fuel_level,
  after_photo_url,
  projects (
    id,
    name
  ),
  generators (
    id,
    name
  )
`;

const SAVED_MINUTES_PER_TRANSACTION = 15;
const ADMIN_RATE_PER_HOUR = 60;

function shortId(value) {
  return value ? `${String(value).slice(0, 8)}...` : 'Unassigned';
}

function getTransactionState(transaction) {
  const hasAfterEvidence =
    Boolean(transaction.after_photo_url) && transaction.after_fuel_level !== null;

  if (hasAfterEvidence) {
    return {
      label: 'Complete',
      className: 'border-green-100 bg-green-50 text-green-700',
    };
  }

  return {
    label: 'Needs after',
    className: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardInsights({ role }) {
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const showSavings = role === 'manager' || role === 'hire_desk';

  const loadInsights = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [projectsResult, transactionsResult, countResult] =
        await Promise.all([
          supabase
            .from('projects')
            .select(PROJECT_SELECT)
            .eq('active', true)
            .order('start_date', { ascending: false })
            .limit(3),
          supabase
            .from('fuel_transactions')
            .select(TRANSACTION_SELECT)
            .order('created_at', { ascending: false })
            .limit(3),
          showSavings
            ? supabase
                .from('fuel_transactions')
                .select('id', { count: 'exact', head: true })
            : Promise.resolve({ count: 0, error: null }),
        ]);

      const firstError =
        projectsResult.error || transactionsResult.error || countResult.error;

      if (firstError) throw firstError;

      setProjects(projectsResult.data || []);
      setTransactions(transactionsResult.data || []);
      setTransactionCount(countResult.count || 0);
    } catch (caughtError) {
      console.error('Error loading dashboard insights:', caughtError);
      setError(caughtError.message || 'Could not load dashboard insights.');
      setProjects([]);
      setTransactions([]);
      setTransactionCount(0);
    } finally {
      setLoading(false);
    }
  }, [showSavings]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadInsights, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadInsights]);

  const savings = useMemo(() => {
    const hours = (transactionCount * SAVED_MINUTES_PER_TRANSACTION) / 60;
    const money = hours * ADMIN_RATE_PER_HOUR;

    return {
      hours,
      money,
      records: transactionCount,
    };
  }, [transactionCount]);

  return (
    <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-4">
        <InsightPanel
          title="Latest active projects"
          eyebrow="Projects"
          href="/resources/projects"
          icon={FolderKanban}
        >
          {loading && <InsightLoading />}
          {!loading && !error && projects.length === 0 && (
            <InsightEmpty text="No active projects yet." />
          )}
          {!loading &&
            !error &&
            projects.map((project) => (
              <ProjectShortcut key={project.id} project={project} />
            ))}
        </InsightPanel>

        <InsightPanel
          title="Latest fuel transactions"
          eyebrow="Transactions"
          href="/resources/fuel-transactions"
          icon={Fuel}
        >
          {loading && <InsightLoading />}
          {!loading && !error && transactions.length === 0 && (
            <InsightEmpty text="No fuel transactions yet." />
          )}
          {!loading &&
            !error &&
            transactions.map((transaction) => (
              <TransactionShortcut
                key={transaction.id}
                transaction={transaction}
              />
            ))}
        </InsightPanel>
      </div>

      {showSavings && (
        <SavingsPanel loading={loading} error={error} savings={savings} />
      )}

      {error && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900 lg:col-span-2">
          {error}
        </div>
      )}
    </section>
  );
}

function InsightPanel({ title, eyebrow, href, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-[#e8edf3] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="page-kicker">{eyebrow}</p>
          <h3 className="mt-1 text-lg font-semibold text-gray-950">{title}</h3>
        </div>
        <Link
          href={href}
          aria-label={`Open ${title}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc] transition active:scale-95"
        >
          <Icon size={19} strokeWidth={2.2} />
        </Link>
      </div>

      <div className="grid gap-2">{children}</div>
    </section>
  );
}

function ProjectShortcut({ project }) {
  return (
    <Link
      href={`/resources/projects/${project.id}`}
      className="flex items-center gap-3 rounded-2xl border border-[#e8edf3] bg-[#fbfdff] p-3 transition active:scale-[0.98] active:bg-[#eef4fb]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
        <FolderKanban size={19} strokeWidth={2.2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-gray-950">
          {project.name || 'Unnamed project'}
        </span>
        <span className="mt-1 flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-xs text-[#717887]">
          {project.location && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin size={13} />
              <span className="truncate">{project.location}</span>
            </span>
          )}
          {project.start_date && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={13} />
              {formatDateShort(project.start_date)}
            </span>
          )}
        </span>
      </span>

      <ArrowRight className="h-4 w-4 shrink-0 text-[#62748e]" />
    </Link>
  );
}

function TransactionShortcut({ transaction }) {
  const state = getTransactionState(transaction);
  const isReturn = transaction.type === 'return';
  const Icon = isReturn ? RotateCcw : Fuel;
  const projectName =
    transaction.projects?.name || shortId(transaction.project_id);
  const generatorName =
    transaction.generators?.name || shortId(transaction.generator_id);

  return (
    <Link
      href={`/resources/fuel-transactions/${transaction.id}`}
      className="flex items-center gap-3 rounded-2xl border border-[#e8edf3] bg-[#fbfdff] p-3 transition active:scale-[0.98] active:bg-[#eef4fb]"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${
          isReturn
            ? 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]'
            : 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]'
        }`}
      >
        <Icon size={19} strokeWidth={2.2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-gray-950">
          {projectName}
        </span>
        <span className="steps-text mt-1 block truncate">{generatorName}</span>
        <span className="steps-text mt-1 block">
          {isReturn ? 'Return' : 'Delivery'}{' '}
          {formatDateShort(transaction.created_at)}
        </span>
      </span>

      <span
        className={`shrink-0 rounded-full border px-2 py-1 text-xs font-semibold ${state.className}`}
      >
        {state.label}
      </span>
    </Link>
  );
}

function SavingsPanel({ loading, error, savings }) {
  return (
    <section className="rounded-2xl border border-[#fee39f] bg-[#fff7e6] p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b7791f]">
            Financial impact
          </p>
          <h3 className="mt-1 text-lg font-semibold text-gray-950">
            Time and money saved
          </h3>
        </div>
        <PiggyBank className="h-6 w-6 shrink-0 text-[#f25822]" />
      </div>

      {loading && <InsightLoading />}
      {!loading && error && (
        <InsightEmpty text="Savings will appear when dashboard data loads." />
      )}
      {!loading && !error && (
        <div className="grid gap-3">
          <SavingTile
            icon={TimerReset}
            label="Estimated time saved"
            value={`${savings.hours.toFixed(1)} hrs`}
          />
          <SavingTile
            icon={PiggyBank}
            label="Estimated admin value"
            value={formatCurrency(savings.money)}
          />
          <SavingTile
            icon={CheckCircle2}
            label="Records digitized"
            value={savings.records}
          />
          <p className="text-xs leading-5 text-[#9a5f12]">
            Estimate uses 15 minutes saved per fuel record at $60/hour admin
            value.
          </p>
        </div>
      )}
    </section>
  );
}

function SavingTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#fee39f] bg-white p-3">
      <div className="mb-2 flex items-center gap-2 text-[#f25822]">
        <Icon size={17} strokeWidth={2.2} />
        <p className="text-xs font-semibold uppercase tracking-[0.08em]">
          {label}
        </p>
      </div>
      <p className="text-xl font-semibold text-gray-950">{value}</p>
    </div>
  );
}

function InsightLoading() {
  return (
    <div className="rounded-2xl border border-[#e8edf3] bg-[#fbfdff] p-3 text-sm text-[#62748e]">
      Loading...
    </div>
  );
}

function InsightEmpty({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d5eefc] bg-[#fbfdff] p-4 text-sm text-[#62748e]">
      {text}
    </div>
  );
}
