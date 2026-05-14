'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Fuel,
  Gauge,
  RefreshCcw,
  ShieldCheck,
  XCircle,
  Zap,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import LoadingIndicator from '@/components/LoadingIndicator';

const ALERT_SELECT = `
  id,
  alert_key,
  project_id,
  project_name,
  asset_type,
  asset_id,
  asset_name,
  risk_level,
  status,
  title,
  description,
  current_liters,
  capacity_liters,
  consumption_liters_per_hour,
  hours_until_empty,
  estimated_empty_at,
  source_transaction_id,
  reviewed_at,
  created_at,
  updated_at
`;

const riskOrder = {
  critical: 0,
  urgent: 1,
  warning: 2,
  unknown: 3,
  ok: 4,
};

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
];

function isMissingTableError(error) {
  return (
    error?.code === '42P01' ||
    error?.message?.toLowerCase().includes('fuel_alerts')
  );
}

function formatLiters(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Unknown';

  return `${number.toFixed(0)} L`;
}

function formatHours(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Unknown';
  if (number < 1) return `${Math.max(Math.round(number * 60), 0)} min`;

  return `${number.toFixed(1)} h`;
}

function formatDateTime(value) {
  if (!value) return 'Unknown';

  return new Intl.DateTimeFormat('en-NZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function riskClass(riskLevel) {
  const classes = {
    critical: 'border-red-200 bg-red-50 text-red-700',
    urgent: 'border-orange-200 bg-orange-50 text-orange-700',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    unknown: 'border-slate-200 bg-slate-50 text-slate-700',
    ok: 'border-green-200 bg-green-50 text-green-700',
  };

  return classes[riskLevel] || classes.unknown;
}

function sortAlerts(alerts) {
  return [...alerts].sort((a, b) => {
    const riskDiff = (riskOrder[a.risk_level] ?? 99) - (riskOrder[b.risk_level] ?? 99);
    if (riskDiff !== 0) return riskDiff;

    return new Date(a.estimated_empty_at || a.created_at) - new Date(b.estimated_empty_at || b.created_at);
  });
}

function AlertSummary({ alerts }) {
  const counts = alerts.reduce(
    (summary, alert) => {
      summary[alert.risk_level] = (summary[alert.risk_level] || 0) + 1;
      return summary;
    },
    { critical: 0, urgent: 0, warning: 0, unknown: 0 }
  );

  return (
    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
      <SummaryTile icon={AlertTriangle} label="Critical" value={counts.critical} tone="critical" />
      <SummaryTile icon={Clock3} label="Urgent" value={counts.urgent} tone="urgent" />
      <SummaryTile icon={Gauge} label="Warning" value={counts.warning} tone="warning" />
      <SummaryTile icon={ShieldCheck} label="Needs data" value={counts.unknown} tone="unknown" />
    </div>
  );
}

function SummaryTile({ icon: Icon, label, value, tone }) {
  const toneClasses = {
    critical: 'bg-red-50 text-red-700 ring-red-100',
    urgent: 'bg-orange-50 text-orange-700 ring-orange-100',
    warning: 'bg-yellow-50 text-yellow-800 ring-yellow-100',
    unknown: 'bg-slate-50 text-slate-700 ring-slate-200',
  };

  return (
    <div className="rounded-[20px] border border-[#e8edf3] bg-white p-3">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ring-1 ${toneClasses[tone]}`}>
        <Icon size={18} strokeWidth={2.3} />
      </div>
      <p className="text-lg font-semibold text-[var(--primary-black)]">{value}</p>
      <p className="steps-text mt-1">{label}</p>
    </div>
  );
}

function AlertCard({ alert, onUpdateStatus, savingId }) {
  const AssetIcon = alert.asset_type === 'generator' ? Zap : Fuel;
  const isSaving = savingId === alert.id;

  return (
    <article className="rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
            <AssetIcon size={22} strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900">
              {alert.asset_name}
            </h3>
            <p className="steps-text mt-1">{alert.project_name || 'Unassigned project'}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${riskClass(alert.risk_level)}`}>
          {alert.risk_level}
        </span>
      </div>

      {alert.description && (
        <p className="mb-4 rounded-[18px] border border-[#e8edf3] bg-[#fbfdff] p-3 text-sm text-[#41516a]">
          {alert.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Detail label="Current" value={formatLiters(alert.current_liters)} />
        <Detail label="Capacity" value={formatLiters(alert.capacity_liters)} />
        <Detail label="Until empty" value={formatHours(alert.hours_until_empty)} />
        <Detail label="Empty at" value={formatDateTime(alert.estimated_empty_at)} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={isSaving || alert.status === option.value}
            onClick={() => onUpdateStatus(alert.id, option.value)}
            className={`h-11 rounded-[18px] border px-3 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
              alert.status === option.value
                ? 'border-[#41516a] bg-[#41516a] text-white'
                : 'border-[#d5eefc] bg-[#eef4fb] text-gray-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-[18px] border border-[#e8edf3] bg-[#f8fbff] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#717887]">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function FuelAlertsClient() {
  const [alerts, setAlerts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('open');
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [savingId, setSavingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [setupRequired, setSetupRequired] = useState(false);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError('');
    setSetupRequired(false);

    let query = supabase
      .from('fuel_alerts')
      .select(ALERT_SELECT)
      .order('created_at', { ascending: false })
      .limit(100);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error: loadError } = await query;

    if (loadError) {
      if (isMissingTableError(loadError)) {
        setSetupRequired(true);
        setAlerts([]);
      } else {
        setError(loadError.message || 'Could not load fuel alerts.');
        setAlerts([]);
      }
    } else {
      setAlerts(data || []);
    }

    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  async function getAccessToken() {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session?.access_token) throw new Error('Sign in again to update fuel alerts.');

    return session.access_token;
  }

  async function handleRecalculate() {
    setRecalculating(true);
    setMessage('');
    setError('');

    try {
      const accessToken = await getAccessToken();
      const response = await fetch('/api/fuel-alerts/recalculate', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload.error || 'Could not recalculate fuel alerts.');

      setMessage(
        `${payload.message} ${payload.open_alerts} open alert${payload.open_alerts === 1 ? '' : 's'} found.`
      );
      await loadAlerts();
    } catch (caughtError) {
      setError(caughtError.message || 'Could not recalculate fuel alerts.');
    } finally {
      setRecalculating(false);
    }
  }

  async function handleUpdateStatus(alertId, status) {
    setSavingId(alertId);
    setMessage('');
    setError('');

    try {
      const accessToken = await getAccessToken();
      const response = await fetch('/api/fuel-alerts/update', {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id: alertId, status }),
      });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload.error || 'Could not update fuel alert.');

      setAlerts((current) =>
        current
          .map((alert) => (alert.id === alertId ? payload.alert : alert))
          .filter((alert) => statusFilter === 'all' || alert.status === statusFilter)
      );
      setMessage('Fuel alert updated.');
    } catch (caughtError) {
      setError(caughtError.message || 'Could not update fuel alert.');
    } finally {
      setSavingId('');
    }
  }

  const sortedAlerts = useMemo(() => sortAlerts(alerts), [alerts]);

  return (
    <main className="mx-auto w-full max-w-[760px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Fuel alerts</p>
      </div>

      <section className="mb-4 rounded-[28px] border border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fee39f] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">Forecast review</p>
            <h2 className="mt-2">Empty fuel predictions</h2>
            <p className="steps-text mt-1">
              Review generator and tank alerts calculated from latest meter readings.
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#f25822] ring-1 ring-white">
            <AlertTriangle size={23} strokeWidth={2.4} />
          </span>
        </div>

        <button
          type="button"
          disabled={recalculating || setupRequired}
          onClick={handleRecalculate}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[22px] border border-white/80 bg-white px-4 text-sm font-semibold text-gray-900 shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw size={18} strokeWidth={2.2} className={recalculating ? 'animate-spin' : ''} />
          {recalculating ? 'Recalculating' : 'Recalculate alerts'}
        </button>
      </section>

      <section className="background-container-white mb-4">
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[{ value: 'open', label: 'Open' }, ...statusOptions.slice(1), { value: 'all', label: 'All' }].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatusFilter(option.value)}
              className={`h-11 rounded-[18px] border px-3 text-sm font-semibold transition active:scale-[0.98] ${
                statusFilter === option.value
                  ? 'border-[#41516a] bg-[#41516a] text-white'
                  : 'border-[#d5eefc] bg-[#eef4fb] text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {setupRequired && (
          <div className="mb-4 rounded-[22px] border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            Run <strong>supabase/fuel_alerts.sql</strong> in Supabase to turn on fuel alert review.
          </div>
        )}

        {message && (
          <div className="mb-4 flex items-start gap-3 rounded-[22px] border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 size={19} strokeWidth={2.2} />
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-[22px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <XCircle size={19} strokeWidth={2.2} />
            <p>{error}</p>
          </div>
        )}

        {loading && <LoadingIndicator />}

        {!loading && !setupRequired && sortedAlerts.length > 0 && (
          <>
            <AlertSummary alerts={sortedAlerts} />
            <div className="grid gap-3">
              {sortedAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  savingId={savingId}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          </>
        )}

        {!loading && !setupRequired && sortedAlerts.length === 0 && (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d5eefc] bg-white p-6 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
              <CheckCircle2 size={24} strokeWidth={2.2} />
            </span>
            <p className="text-base font-semibold text-gray-900">No alerts in this view</p>
            <p className="steps-text mt-1">
              Recalculate alerts after new fuel readings or equipment changes.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
