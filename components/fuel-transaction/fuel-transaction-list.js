'use client';

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Fuel,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

function formatDate(dateValue) {
  if (!dateValue) return '-';

  return new Date(dateValue).toLocaleDateString('en-GB', {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
  });
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function shortId(value) {
  return value ? `${value.slice(0, 8)}...` : 'Unassigned';
}

function getMovement(transaction) {
  const beforeFuel = toNumber(transaction.before_fuel_level);
  const afterFuel = toNumber(transaction.after_fuel_level);

  if (beforeFuel === null || afterFuel === null) {
    return {
      beforeFuel,
      afterFuel,
      amount: null,
      directionMatchesReading: true,
    };
  }

  const rawDifference = afterFuel - beforeFuel;
  const isDelivery = transaction.type === 'delivery';
  const directionMatchesReading =
    rawDifference === 0 || (isDelivery ? rawDifference > 0 : rawDifference < 0);

  return {
    beforeFuel,
    afterFuel,
    amount: Math.abs(rawDifference),
    directionMatchesReading,
  };
}

function getTransactionState(transaction, movement) {
  const hasAfterEvidence =
    Boolean(transaction.after_photo_url) && movement.afterFuel !== null;

  if (!movement.directionMatchesReading) {
    return {
      label: 'Check readings',
      icon: AlertTriangle,
      className: 'border-[#fee39f] bg-[#fff7e6] text-[#9a5f12]',
    };
  }

  if (!hasAfterEvidence) {
    return {
      label: 'Needs after',
      icon: Clock,
      className: 'border-[#fee39f] bg-[#fff7e6] text-[#9a5f12]',
    };
  }

  return {
    label: 'Complete',
    icon: CheckCircle2,
    className: 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]',
  };
}

function MovementIcon({ type }) {
  const isDelivery = type === 'delivery';
  const Icon = isDelivery ? Fuel : RotateCcw;

  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ${
        isDelivery
          ? 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]'
          : 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]'
      }`}
    >
      <Icon size={21} strokeWidth={2.2} />
    </span>
  );
}

function StatePill({ state }) {
  const Icon = state.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${state.className}`}
    >
      <Icon size={13} strokeWidth={2.4} />
      {state.label}
    </span>
  );
}

function FuelTransactionRow({ transaction }) {
  const movement = getMovement(transaction);
  const state = getTransactionState(transaction, movement);
  const isDelivery = transaction.type === 'delivery';
  const sign = transaction.type === 'delivery' ? '+' : '-';
  const movementLabel =
    movement.amount === null
      ? 'Pending'
      : `${sign}${movement.amount.toFixed(2)} L`;
  const projectName =
    transaction.projects?.name || shortId(transaction.project_id);
  const generatorName =
    transaction.generators?.name || shortId(transaction.generator_id);

  return (
    <li className="w-full">
      <Link
        className="flex items-center gap-3 rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)] transition active:scale-[0.98] active:border-[#62748e] active:bg-[#eef4fb]"
        href={`/resources/fuel-transactions/${transaction.id}`}
      >
        <MovementIcon type={transaction.type} />

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-[var(--primary-black)]">
              {projectName}
            </span>
          </span>
          <span className="steps-text mt-1 block truncate">
            {generatorName}
          </span>
          <span className="steps-text mt-2 block">
            {isDelivery ? 'Delivered' : 'Returned'}{' '}
            {formatDate(transaction.created_at)}
          </span>
        </span>

        <span className="flex shrink-0 flex-col items-end gap-2 text-right">
          <span
            className={`text-base font-semibold ${
              movement.amount === null
                ? 'text-[#717887]'
                : isDelivery
                  ? 'text-[#f25822]'
                  : 'text-[#62748e]'
            }`}
          >
            {movementLabel}
          </span>
          <StatePill state={state} />
        </span>

        <ArrowRight
          className="hidden shrink-0 text-[#aab6c3] sm:block"
          size={17}
        />
      </Link>
    </li>
  );
}

export default function FuelTransactionsList({
  transactions = [],
  type = 'delivery',
}) {
  const typeLabel = type === 'delivery' ? 'Delivery' : 'Return';

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between border-b border-[#e8edf3] pb-3 text-sm font-semibold text-[#62748e]">
        <span>{typeLabel}</span>
        <span>Status</span>
      </div>

      <ul className="flex w-full flex-col gap-2">
        {transactions.map((transaction) => (
          <FuelTransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </ul>
    </div>
  );
}
