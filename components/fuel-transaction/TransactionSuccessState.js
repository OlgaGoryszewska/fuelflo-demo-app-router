'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  FileText,
  PlusCircle,
  WifiOff,
} from 'lucide-react';

export default function TransactionSuccessState({
  eyebrow,
  title,
  description,
  items,
  primaryAction,
  secondaryAction,
  isOffline,
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700 ring-1 ring-green-100">
            <CheckCircle2 size={25} strokeWidth={2.2} />
          </span>

          <div className="min-w-0">
            <p className="steps-text mb-1">{eyebrow}</p>
            <h2>{title}</h2>
            {description && <p className="steps-text mt-1">{description}</p>}
          </div>
        </div>

        {items?.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white px-3">
            {items.map((item) => {
              const Icon = item.complete ? CheckCircle2 : Circle;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 border-b border-gray-100 py-3 last:border-b-0"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon
                      size={18}
                      className={
                        item.complete ? 'text-green-700' : 'text-[#717887]'
                      }
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {item.label}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-xs font-semibold uppercase tracking-[0.08em] text-[#717887]">
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isOffline && (
        <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
            <WifiOff size={20} strokeWidth={2.2} />
          </span>
          <p className="text-sm text-[#62748e]">
            Saved offline. Evidence will stay linked to this transaction and
            sync when connection returns.
          </p>
        </div>
      )}

      <div className="grid gap-3">
        {primaryAction?.href ? (
          <Link
            href={primaryAction.href}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#d5eefc] bg-[#eef4fb] px-4 text-sm font-semibold text-gray-900 shadow-sm transition active:scale-[0.98] active:bg-[#dbeaf5]"
          >
            {primaryAction.label}
            <ArrowRight size={18} strokeWidth={2.2} />
          </Link>
        ) : primaryAction ? (
          <button
            type="button"
            onClick={primaryAction.onClick}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#d5eefc] bg-[#eef4fb] px-4 text-sm font-semibold text-gray-900 shadow-sm transition active:scale-[0.98] active:bg-[#dbeaf5]"
          >
            {primaryAction.label}
            <ArrowRight size={18} strokeWidth={2.2} />
          </button>
        ) : null}

        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 text-sm font-semibold text-gray-800 shadow-sm transition active:scale-[0.98]"
          >
            {secondaryAction.icon === 'plus' ? (
              <PlusCircle size={18} strokeWidth={2.2} />
            ) : (
              <FileText size={18} strokeWidth={2.2} />
            )}
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </section>
  );
}
