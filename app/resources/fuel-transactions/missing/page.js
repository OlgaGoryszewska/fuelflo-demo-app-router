'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Fuel,
  Gauge,
  RotateCcw,
  Search,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import LoadingIndicator from '@/components/LoadingIndicator';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatLitres(value) {
  return `${toNumber(value).toFixed(0)} L`;
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
    {
      label: 'Missing',
      href: '/resources/fuel-transactions/missing',
      type: 'missing',
    },
  ];

  return (
    <div className="mb-4 grid grid-cols-3 gap-2 rounded-[22px] border border-[#e8edf3] bg-white/70 p-1">
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
    amber: 'bg-[#fff7e6] text-[#9a5f12] ring-[#fee39f]',
    green: 'bg-[#f3fbef] text-[#2f8f5b] ring-[#d7edce]',
    orange: 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]',
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

function getVarianceRow(project, summary) {
  const delivered = toNumber(summary?.total_delivered_litres);
  const returned = toNumber(summary?.total_returned_litres);
  const netUsed =
    summary?.net_used_litres === null || summary?.net_used_litres === undefined
      ? delivered - returned
      : toNumber(summary?.net_used_litres);
  const expected = toNumber(project.expected_liters);
  const variance = expected > 0 ? netUsed - expected : 0;
  const missing = Math.max(variance, 0);
  const returnRate = delivered > 0 ? (returned / delivered) * 100 : 0;

  return {
    project,
    delivered,
    returned,
    netUsed,
    expected,
    variance,
    missing,
    returnRate,
    needsReview: missing > 0,
  };
}

function MissingFuelRow({ row }) {
  return (
    <Link
      href={`/resources/projects/${row.project.id}`}
      className="block rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)] transition active:scale-[0.98] active:border-[#62748e] active:bg-[#eef4fb]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--primary-black)]">
            {row.project.name || `Project ${row.project.id}`}
          </p>
          <p className="steps-text mt-1 truncate">
            {row.project.location || 'No location saved'}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${
            row.needsReview
              ? 'border-[#fee39f] bg-[#fff7e6] text-[#9a5f12]'
              : 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]'
          }`}
        >
          {row.needsReview ? 'Needs review' : 'Balanced'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-[18px] border border-[#e8edf3] bg-[#f8fbff] p-3">
          <p className="steps-text">Delivered</p>
          <p className="mt-1 text-sm font-semibold text-[var(--primary-black)]">
            {formatLitres(row.delivered)}
          </p>
        </div>
        <div className="rounded-[18px] border border-[#e8edf3] bg-[#f8fbff] p-3">
          <p className="steps-text">Returned</p>
          <p className="mt-1 text-sm font-semibold text-[var(--primary-black)]">
            {formatLitres(row.returned)}
          </p>
        </div>
        <div className="rounded-[18px] border border-[#e8edf3] bg-[#f8fbff] p-3">
          <p className="steps-text">Expected use</p>
          <p className="mt-1 text-sm font-semibold text-[var(--primary-black)]">
            {row.expected > 0 ? formatLitres(row.expected) : 'Missing'}
          </p>
        </div>
        <div
          className={`rounded-[18px] border p-3 ${
            row.needsReview
              ? 'border-[#fee39f] bg-[#fff7e6]'
              : 'border-[#d7edce] bg-[#f3fbef]'
          }`}
        >
          <p className="steps-text">Unaccounted</p>
          <p
            className={`mt-1 text-sm font-semibold ${
              row.needsReview ? 'text-[#9a5f12]' : 'text-[#2f8f5b]'
            }`}
          >
            {formatLitres(row.missing)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="steps-text">
          Net used {formatLitres(row.netUsed)} • Returns{' '}
          {row.returnRate.toFixed(0)}%
        </p>
        <ArrowRight className="h-5 w-5 shrink-0 text-[#62748e]" />
      </div>
    </Link>
  );
}

export default function MissingFuelPage() {
  const [projects, setProjects] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');

      const [projectResult, summaryResult] = await Promise.all([
        supabase
          .from('projects')
          .select('id, name, location, expected_liters, active')
          .order('start_date', { ascending: false }),
        supabase.from('project_fuel_summary').select('*'),
      ]);

      if (projectResult.error) {
        setError(projectResult.error.message);
        setProjects([]);
      } else {
        setProjects(projectResult.data || []);
      }

      if (summaryResult.error) {
        setError(summaryResult.error.message);
        setSummaries([]);
      } else {
        setSummaries(summaryResult.data || []);
      }

      setLoading(false);
    }

    load();
  }, []);

  const rows = useMemo(() => {
    const summariesByProject = new Map(
      summaries.map((summary) => [String(summary.project_id), summary])
    );

    return projects.map((project) =>
      getVarianceRow(project, summariesByProject.get(String(project.id)))
    );
  }, [projects, summaries]);

  const filteredRows = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    if (!searchText) return rows;

    return rows.filter((row) => {
      const haystack = [row.project.name, row.project.location]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchText);
    });
  }, [query, rows]);

  const summary = useMemo(() => {
    return rows.reduce(
      (totals, row) => {
        totals.delivered += row.delivered;
        totals.returned += row.returned;
        totals.missing += row.missing;
        if (row.needsReview) totals.needsReview += 1;
        return totals;
      },
      {
        delivered: 0,
        returned: 0,
        missing: 0,
        needsReview: 0,
      }
    );
  }, [rows]);

  return (
    <div className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Fuel transactions</p>
      </div>

      <div className="background-container">
        <TypeTabs activeType="missing" />

        <div className="mb-4">
          <h2>Missing fuel</h2>
          <p className="steps-text mt-1">
            Compare delivered fuel, returned fuel, and expected use by project.
          </p>
        </div>

        {!loading && !error && rows.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            <SummaryTile
              icon={AlertTriangle}
              label="Unaccounted"
              value={formatLitres(summary.missing)}
              tone={summary.missing > 0 ? 'amber' : 'green'}
            />
            <SummaryTile
              icon={Gauge}
              label="Needs review"
              value={summary.needsReview}
              tone={summary.needsReview > 0 ? 'amber' : 'green'}
            />
            <SummaryTile
              icon={Fuel}
              label="Delivered"
              value={formatLitres(summary.delivered)}
              tone="orange"
            />
            <SummaryTile
              icon={RotateCcw}
              label="Returned"
              value={formatLitres(summary.returned)}
            />
          </div>
        )}

        <label className="relative mb-4 block">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#717887]"
            size={18}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search project or location"
            className="!pl-12"
          />
        </label>

        {loading && <LoadingIndicator />}

        {error && (
          <div className="rounded-[24px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
            {error}
          </div>
        )}

        {!loading && !error && filteredRows.length === 0 && (
          <div className="rounded-[24px] border border-[#e8edf3] bg-white p-4">
            <p className="text-sm font-semibold text-[var(--primary-black)]">
              No missing fuel rows found.
            </p>
            <p className="steps-text mt-1">
              Add expected litres to projects and close transaction evidence to
              calculate variance.
            </p>
          </div>
        )}

        {!loading && !error && filteredRows.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {filteredRows.map((row) => (
              <MissingFuelRow key={row.project.id} row={row} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
