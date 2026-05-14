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
  TrendingUp,
  Users,
  FileText,
  Plus,
  Settings,
} from 'lucide-react';
import DashboardInsights from '@/components/dashboard/DashboardInsights';
import DashboardTaskPanel from '@/components/dashboard/DashboardTaskPanel';
import { getDashboardConfig } from '@/lib/navigation/roleNavigation';

const METRIC_ICONS = {
  success: CheckCircle2,
  warning: Clock3,
  info: Activity,
  default: TrendingUp,
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

  const secondaryActions = dashboard.primaryActions.slice(1);

  return (
    <main className=" text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-slate-600 mb-2">{dashboard.eyebrow}</p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{dashboard.title}</h1>
          <p className="mt-3 text-lg text-slate-600 max-w-3xl">{dashboard.description}</p>
        </div>

        {/* Status and Primary Actions */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <StatusPill isOnline={isOnline} />
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
            <Radio size={16} strokeWidth={2.2} />
            Sync ready
          </span>
          {secondaryActions.length > 0 && (
            <div className="ml-auto flex gap-2">
              {secondaryActions.map((item) => (
                <DashboardAction key={item.href} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Priority Work Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Gauge className="h-5 w-5 text-slate-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Priority work</p>
                  <h2 className="text-xl font-bold text-slate-900">Start here</h2>
                </div>
              </div>

              {dashboard.focus && (
                <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-orange-100 p-2">
                      <ClipboardCheck className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Today&apos;s focus</p>
                      <p className="mt-1 text-sm text-slate-600">{dashboard.focus}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {dashboard.priorityActions.map((item) => (
                  <PriorityCard key={item.href} item={item} />
                ))}
              </div>
            </div>

            {/* Insights */}
            <DashboardInsights role={role} />

            {/* Workspace Navigation */}
            <WorkspaceNav sections={dashboard.sections} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-5 w-5 text-slate-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Activity</p>
                  <h3 className="text-lg font-bold text-slate-900">Recent signals</h3>
                </div>
              </div>

              <div className="space-y-3">
                {dashboard.activityItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="rounded-full bg-slate-100 p-1.5">
                      <CheckCircle2 className="h-4 w-4 text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Utility Links */}
            {dashboard.utilityLinks.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">Tools</p>
                <div className="space-y-2">
                  {dashboard.utilityLinks.map((item) => (
                    <DashboardAction key={item.href} item={item} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusPill({ isOnline }) {
  const Icon = isOnline ? Wifi : WifiOff;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${
        isOnline
          ? 'border-green-200 bg-green-50 text-green-800'
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
    <div className={`rounded-2xl border p-6 shadow-sm ${toneClass}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider">
          {metric.label}
        </p>
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <p className="text-2xl font-bold leading-none">{metric.value}</p>
      <p className="mt-2 text-sm opacity-80">{metric.caption}</p>
    </div>
  );
}

function PriorityCard({ item }) {
  const Icon = item.icon || Fuel;

  return (
    <Link
      href={item.href}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="rounded-xl bg-slate-100 p-2 group-hover:bg-orange-100 transition-colors">
          <Icon className="h-6 w-6 text-slate-600 group-hover:text-orange-600" />
        </div>
        <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600" />
      </div>

      <div>
        <p className="text-lg font-bold text-slate-900 mb-2">{item.label}</p>
        {item.description && (
          <p className="text-sm text-slate-600 leading-relaxed">
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium shadow-sm transition hover:shadow-md ${
        compact ? 'px-3 py-2' : 'px-4 py-3'
      } ${
        isPrimary
          ? 'border-orange-600 bg-orange-600 text-white hover:bg-orange-700'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      <Icon size={16} strokeWidth={2.2} />
      <span className="truncate">{item.label}</span>
      {isPrimary && <ArrowRight size={16} strokeWidth={2.2} />}
    </Link>
  );
}

function WorkspaceNav({ sections }) {
  if (sections.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <LayoutGrid className="h-5 w-5 text-slate-600" />
        <div>
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Workspace</p>
          <h3 className="text-xl font-bold text-slate-900">Browse everything</h3>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon || section.items?.[0]?.icon || LayoutGrid;

          return (
            <div
              key={section.title}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-white p-2">
                  <Icon className="h-5 w-5 text-slate-600" />
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {section.title}
                </p>
              </div>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <WorkspaceLink key={item.href} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkspaceLink({ item }) {
  const Icon = item.icon || Fuel;

  return (
    <Link
      href={item.href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
    >
      <Icon size={14} strokeWidth={2.2} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function metricToneClass(tone) {
  if (tone === 'success') {
    return 'border-green-200 bg-green-50 text-green-800';
  }

  if (tone === 'warning') {
    return 'border-yellow-200 bg-yellow-50 text-yellow-800';
  }

  if (tone === 'info') {
    return 'border-blue-200 bg-blue-50 text-blue-800';
  }

  return 'border-slate-200 bg-white text-slate-900';
}
