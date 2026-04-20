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
    <li
      className="file-row w-full flex items-center justify-between"
      key={transaction.id}
    >
      <Link
        className="steps-text"
        href={`/resources/fuel-transactions/${transaction.id}`}
      >
        {formatDate(transaction.created_at)}
      </Link>
      {sign} {difference.toFixed(2)} L
    </li>
  );
}

export default function FuelTransactionsList({ transactions = [] }) {
  return (
  
      <div className="flex flex-col w-full">
        <div className="pr-2 w-full flex justify-between">
          <h4>Date</h4>
          <h4>Vol</h4>
        </div>

        <ul className="flex flex-col w-full">
          {transactions.map((transaction) => (
            <FuelTransactionRow
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </ul>
      </div>

  );
}
