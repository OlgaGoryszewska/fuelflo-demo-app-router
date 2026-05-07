'use client';

import Link from 'next/link';

function formatDate(dateValue) {
  if (!dateValue) return '-';

  return new Date(dateValue).toLocaleDateString('en-GB', {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
  });
}

function FuelTransactionRow({ transaction }) {
  const beforeFuel = Number(transaction.before_fuel_level) || 0;
  const afterFuel = Number(transaction.after_fuel_level) || 0;
  const difference = Math.abs(afterFuel - beforeFuel);
  const sign = transaction.type === 'delivery' ? '+' : '-';

  return (
    <li className="w-full">
      <Link
        className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition active:scale-[0.98] active:border-[#62748e] active:bg-[#eef4fb]"
        href={`/resources/fuel-transactions/${transaction.id}`}
      >
        <span className="steps-text text-gray-900">
          {formatDate(transaction.created_at)}
        </span>
        <span className="text-sm font-semibold text-[#62748e]">
          {sign} {difference.toFixed(2)} L
        </span>
      </Link>
    </li>
  );
}

export default function FuelTransactionsList({ transactions = [] }) {
  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 text-sm font-semibold text-[#62748e]">
        <span>Date</span>
        <span>Volume</span>
      </div>

      <ul className="flex flex-col w-full gap-1">
        {transactions.map((transaction) => (
          <FuelTransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </ul>
    </div>
  );
}
