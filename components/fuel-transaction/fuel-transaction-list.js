'use client';

import Link from 'next/link';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';

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

      <span>
        {sign} {difference.toFixed(2)} L
      </span>
    </li>
  );
}

export default function FuelTransactionsList({ transactions = [] }) {
  return (
    <div className="generator-container mb-4">
      <div className="form-header-with-button">
        <BoltOutlinedIcon className="gray-icon" />
        <h3 className="ml-2 uppercase">Fuel Transactions</h3>
      </div>

      <div className="divider-full"></div>

      <div className="flex flex-col w-full">
        <div className="background-header p-0 w-full flex justify-between">
          <p>Date</p>
          <p>Vol</p>
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
    </div>
  );
}
