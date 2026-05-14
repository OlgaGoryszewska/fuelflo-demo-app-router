'use client';

import Link from 'next/link';
import { AlertCircle, Plus, Search } from 'lucide-react';

export function ResourcePageShell({
  title,
  eyebrow,
  description,
  count,
  actionHref,
  actionLabel,
  children,
}) {
  return (
    <main className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">{eyebrow}</p>
      </div>

      <section className="mb-4 rounded-[28px] border border-[#d9e2ec] bg-gradient-to-br from-white via-[#f8fbff] to-[#d5eefc] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">{eyebrow}</p>
            <h2 className="mt-1">{title}</h2>
            {description && <p className="steps-text mt-1">{description}</p>}
          </div>

          <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-[#62748e] ring-1 ring-white">
            {count}
          </span>
        </div>
      </section>

      <section className="background-container-white mb-4">
        <Link
          href={actionHref}
          className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-[22px] border border-[#d5eefc] bg-[#eef4fb] px-4 text-sm font-semibold text-gray-900 shadow-sm transition active:scale-[0.98] active:bg-[#dbeaf5]"
        >
          <Plus size={18} strokeWidth={2.2} />
          {actionLabel}
        </Link>

        {children}
      </section>
    </main>
  );
}

export function ResourceSearch({ value, onChange, placeholder }) {
  return (
    <div className="relative mb-4">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#717887]"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="!pl-12"
      />
    </div>
  );
}

export function ResourceError({ message }) {
  if (!message) return null;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <AlertCircle size={20} strokeWidth={2.2} />
      <p>{message}</p>
    </div>
  );
}

export function ResourceEmptyState({ icon: Icon, title, description, actionHref, actionLabel }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d5eefc] bg-white p-6 text-center">
      {Icon && (
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
          <Icon size={24} strokeWidth={2.2} />
        </span>
      )}
      <p className="text-base font-semibold text-gray-900">{title}</p>
      {description && <p className="steps-text mt-1">{description}</p>}
      <Link
        href={actionHref}
        className="mt-4 flex h-11 items-center justify-center gap-2 rounded-[22px] border border-[#d5eefc] bg-[#eef4fb] px-4 text-sm font-semibold text-gray-900 shadow-sm transition active:scale-[0.98]"
      >
        <Plus size={17} strokeWidth={2.2} />
        {actionLabel}
      </Link>
    </div>
  );
}

export function StatTile({ label, value, icon: Icon }) {
  return (
    <div className="rounded-[18px] border border-[#e8edf3] bg-[#f8fbff] p-3">
      <div className="mb-2 flex items-center gap-2 text-[#717887]">
        {Icon && <Icon size={16} strokeWidth={2.2} />}
        <p className="text-xs font-semibold uppercase tracking-[0.08em]">
          {label}
        </p>
      </div>
      <p className="truncate text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export function DetailLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#edf1f5] py-3 last:border-b-0">
      <p className="text-sm text-[#717887]">{label}</p>
      <p className="max-w-[60%] truncate text-right text-sm font-semibold text-gray-900">
        {value || 'Missing'}
      </p>
    </div>
  );
}
