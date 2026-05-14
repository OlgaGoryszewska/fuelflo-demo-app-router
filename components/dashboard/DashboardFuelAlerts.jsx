'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, CheckCircle2, Fuel, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ALERT_SELECT = `
  id,
  project_name,
  asset_type,
  asset_name,
  risk_level,
  status,
  hours_until_empty,
  estimated_empty_at,
  created_at
`;

const riskOrder = {
  critical: 0,
  urgent: 1,
  warning: 2,
  unknown: 3,
};

function isMissingTableError(error) {
  return (
    error?.code === '42P01' ||
    error?.message?.toLowerCase().includes('fuel_alerts')
  );
}

function formatHours(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Needs data';
  if (number < 1) return `${Math.max(Math.round(number * 60), 0)} min`;

  return `${number.toFixed(1)} h`;
}

function riskClass(riskLevel) {
  const classes = {
    critical: 'border-red-200 bg-red-50 text-red-700',
    urgent: 'border-orange-200 bg-orange-50 text-orange-700',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    unknown: 'border-slate-200 bg-slate-50 text-slate-700',
  };

  return classes[riskLevel] || classes.unknown;
}

export default function DashboardFuelAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setSetupRequired(false);

    const { data, error } = await supabase
      .from('fuel_alerts')
      .select(ALERT_SELECT)
      .eq('status', 'open')
      .limit(12);

    if (error) {
      setAlerts([]);
      setSetupRequired(isMissingTableError(error));
    } else {
      setAlerts(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadAlerts, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAlerts]);

  const sortedAlerts = useMemo(() => {
    return [...alerts]
      .sort((a, b) => {
        const riskDiff = (riskOrder[a.risk_level] ?? 99) - (riskOrder[b.risk_level] ?? 99);
        if (riskDiff !== 0) return riskDiff;

        return new Date(a.estimated_empty_at || a.created_at) - new Date(b.estimated_empty_at || b.created_at);
      })
      .slice(0, 4);
  }, [alerts]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-600">
            Fuel alerts
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">
            Empty predictions
          </h3>
        </div>
        <Link
          href="/resources/fuel-alerts"
          aria-label="Open fuel alerts"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc] transition active:scale-95"
        >
          <ArrowRight size={18} strokeWidth={2.2} />
        </Link>
      </div>

      {loading && (
        <div className="space-y-2">
          <div className="h-14 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-14 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      )}

      {!loading && setupRequired && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-900">
          Run the fuel alerts SQL to enable predictions.
        </div>
      )}

      {!loading && !setupRequired && sortedAlerts.length === 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>No open fuel alerts.</p>
        </div>
      )}

      {!loading && !setupRequired && sortedAlerts.length > 0 && (
        <div className="space-y-2">
          {sortedAlerts.map((alert) => {
            const AssetIcon = alert.asset_type === 'generator' ? Zap : Fuel;

            return (
              <Link
                key={alert.id}
                href="/resources/fuel-alerts"
                className="flex items-start gap-3 rounded-2xl border border-[#e8edf3] bg-[#fbfdff] p-3 transition active:scale-[0.98] active:bg-[#eef4fb]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                  <AssetIcon size={18} strokeWidth={2.2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {alert.asset_name}
                  </span>
                  <span className="mt-1 block truncate text-xs text-[#717887]">
                    {alert.project_name || 'Unassigned project'} - {formatHours(alert.hours_until_empty)}
                  </span>
                </span>
                <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold uppercase ${riskClass(alert.risk_level)}`}>
                  {alert.risk_level === 'critical' && <AlertTriangle size={12} className="mr-1 inline" />}
                  {alert.risk_level}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
