'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Fuel,
  Gauge,
  LayoutGrid,
  Radio,
  Wifi,
  WifiOff,
} from 'lucide-react';
import DashboardInsights from '@/components/dashboard/DashboardInsights';
import DashboardTaskPanel from '@/components/dashboard/DashboardTaskPanel';
import { getDashboardConfig } from '@/lib/navigation/roleNavigation';

const METRIC_ICONS = {
  success: CheckCircle2,
  warning: Clock3,
  info: Activity,
  default: ClipboardCheck,
};

function getOnlineSnapshot() {
  return navigator.onLine;
}

function subscribeToOnlineStatus(onStoreChange) {
  window.addEventListener('online', onStoreChange);
  window.addEventListener('offline', onStoreChange);

  return () => {
    window.removeEventListener('online', onStoreChange);
    window.removeEventListener('offline', onStoreChange);
  };
}

export default function RoleDashboard({
  role,
  eyebrow,
  title,
  description,
  focus,
  metrics = [],
  primaryActions = [],
  priorityActions = [],
  sections = [],
  utilityLinks = [],
  activityItems = [],
}) {
  const dashboardConfig = useMemo(() => {
    if (!role) return null;

    return getDashboardConfig(role);
  }, [role]);

  const dashboard = {
    eyebrow: eyebrow ?? dashboardConfig?.eyebrow,
    title: title ?? dashboardConfig?.title,
    description: description ?? dashboardConfig?.description,
    focus: focus ?? dashboardConfig?.focus,
    metrics: metrics.length > 0 ? metrics : dashboardConfig?.metrics || [],
    primaryActions:
      primaryActions.length > 0
        ? primaryActions
        : dashboardConfig?.primaryActions || [],
    priorityActions:
      priorityActions.length > 0
        ? priorityActions
        : dashboardConfig?.priorityActions || [],
    sections: sections.length > 0 ? sections : dashboardConfig?.sections || [],
    utilityLinks:
      utilityLinks.length > 0 ? utilityLinks : dashboardConfig?.utilityLinks || [],
    activityItems:
      activityItems.length > 0
        ? activityItems
        : dashboardConfig?.activityItems || [],
  };

  const isOnline = useSyncExternalStore(
    subscribeToOnlineStatus,
    getOnlineSnapshot,
    () => true
  );

  const primaryAction = dashboard.primaryActions[0];
  const secondaryActions = dashboard.primaryActions.slice(1);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-3 pb-24">
      <div className="mb-2">
        <h1 className="ml-2">{dashboard.eyebrow}</h1>
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/80 p-3 shadow-sm ring-1 ring-[#d5eefc]/70 backdrop-blur sm:p-4">
        <section className="rounded-2xl border border-[#e8edf3] bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusPill isOnline={isOnline} />
                <span className="inline-flex h-9 items-center gap-2 rounded-full border border-[#d5eefc] bg-[#f5fbff] px-3 text-sm font-semibold text-[#62748e]">
                  <Radio size={16} strokeWidth={2.2} />
                  Sync ready
                </span>
              </div>

              <h2 className="text-[26px] leading-tight text-gray-950 sm:text-[32px]">
                {dashboard.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#62748e]">
                {dashboard.description}
              </p>
            </div>

            {primaryAction && (
              <DashboardAction item={primaryAction} variant="primary" />
            )}
          </div>

          {secondaryActions.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              {secondaryActions.map((item) => (
                <DashboardAction key={item.href} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardMetric
            metric={{
              label: 'Connection',
              value: isOnline ? 'Online' : 'Offline',
              caption: isOnline ? 'Live updates available' : 'Saving locally',
              tone: isOnline ? 'success' : 'warning',
            }}
            icon={isOnline ? Wifi : WifiOff}
          />

          {dashboard.metrics.map((metric) => (
            <DashboardMetric key={metric.label} metric={metric} />
          ))}
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-[#e8edf3] bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="page-kicker">Priority work</p>
                <h3 className="mt-1 text-lg font-semibold text-gray-950">
                  Start here
                </h3>
              </div>
              <Gauge className="h-5 w-5 text-[#62748e]" />
            </div>

            {dashboard.focus && (
              <div className="mb-4 rounded-2xl border border-[#d5eefc] bg-[#f5fbff] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#62748e] ring-1 ring-[#d5eefc]">
                    <ClipboardCheck size={20} strokeWidth={2.2} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Today’s focus
                    </p>
                    <p className="mt-1 text-sm leading-5 text-[#62748e]">
                      {dashboard.focus}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              {dashboard.priorityActions.map((item) => (
                <PriorityCard key={item.href} item={item} />
              ))}
            </div>
          </section>

          <DashboardTaskPanel role={role} />

          <aside className="flex flex-col gap-4">
            <section className="rounded-2xl border border-[#e8edf3] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="page-kicker">Activity</p>
                  <h3 className="mt-1 text-base font-semibold text-gray-950">
                    Recent signals
                  </h3>
                </div>
                <Activity className="h-5 w-5 text-[#62748e]" />
              </div>

              <div className="flex flex-col gap-3">
                {dashboard.activityItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                      <CheckCircle2 size={16} strokeWidth={2.2} />
                    </span>
                    <p className="text-sm leading-5 text-[#62748e]">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {dashboard.utilityLinks.length > 0 && (
              <section className="rounded-2xl border border-[#e8edf3] bg-white p-4 shadow-sm">
                <p className="page-kicker mb-3">Tools</p>
                <div className="grid grid-cols-1 gap-2">
                  {dashboard.utilityLinks.map((item) => (
                    <DashboardAction key={item.href} item={item} compact />
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>

        <DashboardInsights role={role} />

        <WorkspaceNav sections={dashboard.sections} />
      </div>
    </main>
  );
}

function StatusPill({ isOnline }) {
  const Icon = isOnline ? Wifi : WifiOff;

  return (
    <span
      className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-sm font-semibold ${
        isOnline
          ? 'border-green-100 bg-green-50 text-green-700'
          : 'border-yellow-200 bg-yellow-50 text-yellow-800'
      }`}
    >
      <Icon size={16} strokeWidth={2.2} />
      {isOnline ? 'Online' : 'Offline'}
    </span>
  );
}

function DashboardMetric({ metric, icon: IconOverride }) {
  const Icon =
    IconOverride || metric.icon || METRIC_ICONS[metric.tone] || METRIC_ICONS.default;
  const toneClass = metricToneClass(metric.tone);

  return (
    <article className={`rounded-2xl border p-4 shadow-sm ${toneClass}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em]">
          {metric.label}
        </p>
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <p className="text-2xl font-semibold leading-none">{metric.value}</p>
      <p className="mt-2 text-sm opacity-80">{metric.caption}</p>
    </article>
  );
}

function PriorityCard({ item }) {
  const Icon = item.icon || Fuel;

  return (
    <Link
      href={item.href}
      className="group flex min-h-[132px] flex-col justify-between rounded-2xl border border-gray-100 bg-[#fbfdff] p-4 shadow-sm transition active:scale-[0.98] active:border-[#62748e] active:bg-[#eef4fb]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
          <Icon size={22} strokeWidth={2.2} />
        </span>
        <ArrowRight className="h-5 w-5 text-[#62748e] transition group-active:translate-x-0.5" />
      </div>

      <div className="mt-4">
        <p className="text-base font-semibold text-gray-950">{item.label}</p>
        {item.description && (
          <p className="mt-1 text-sm leading-5 text-[#62748e]">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
}

function DashboardAction({ item, variant = 'default', compact = false }) {
  const Icon = item.icon || Fuel;
  const isPrimary = variant === 'primary';

  return (
    <Link
      href={item.href}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border text-sm font-semibold shadow-sm transition active:scale-[0.98] ${
        compact ? 'min-h-11 px-3 py-2' : 'min-h-12 px-4 py-3'
      } ${
        isPrimary
          ? 'border-[#f25822] bg-[#f25822] text-white active:bg-[#d94620]'
          : 'border-[#d5eefc] bg-[#f5fbff] text-[#41516a] active:bg-[#eef4fb]'
      }`}
    >
      <Icon size={18} strokeWidth={2.3} />
      <span className="truncate">{item.label}</span>
      {isPrimary && <ArrowRight size={18} strokeWidth={2.3} />}
    </Link>
  );
}

function WorkspaceNav({ sections }) {
  if (sections.length === 0) return null;

  return (
    <section className="mt-4 rounded-2xl border border-[#e8edf3] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="page-kicker">Workspace</p>
          <h3 className="mt-1 text-lg font-semibold text-gray-950">
            Browse everything
          </h3>
        </div>
        <LayoutGrid className="h-5 w-5 text-[#62748e]" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon || section.items?.[0]?.icon || LayoutGrid;

          return (
            <div
              key={section.title}
              className="rounded-2xl border border-gray-100 bg-[#fbfdff] p-3"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                <p className="text-sm font-semibold text-gray-950">
                  {section.title}
                </p>
              </div>

              <div className="grid gap-1">
                {section.items.map((item) => (
                  <WorkspaceLink key={item.href} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WorkspaceLink({ item }) {
  const Icon = item.icon || Fuel;

  return (
    <Link
      href={item.href}
      className="flex min-h-10 items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-[#41516a] transition active:bg-[#eef4fb]"
    >
      <Icon size={15} strokeWidth={2.2} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function metricToneClass(tone) {
  if (tone === 'success') {
    return 'border-green-100 bg-green-50 text-green-800';
  }

  if (tone === 'warning') {
    return 'border-yellow-200 bg-yellow-50 text-yellow-900';
  }

  if (tone === 'info') {
    return 'border-[#d5eefc] bg-[#f5fbff] text-[#41516a]';
  }

  return 'border-gray-100 bg-white text-gray-900';
}
