'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

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
    <li className="file-row w-full flex items-center justify-between">
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

export default function ProjectFuelTransactionsList({ projectId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTransactions() {
      if (!projectId) return;

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('fuel_transactions')
        .select(
          'id, project_id, type, created_at, before_fuel_level, after_fuel_level'
        )
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        setTransactions([]);
      } else {
        setTransactions(data || []);
      }

      setLoading(false);
    }

    loadTransactions();
  }, [projectId]);

  return (
    <div className="background-container-white mb-4">
      <h2>Fuel Transactions</h2>

      <div className="flex flex-col w-full">
        <div className="pr-2 w-full flex justify-between">
          <h4>Date</h4>
          <h4>Vol</h4>
        </div>

        {loading && <p className="steps-text">Loading...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && transactions.length === 0 && (
          <p className="steps-text">No transactions found.</p>
        )}

        {!loading && !error && transactions.length > 0 && (
          <ul className="flex flex-col w-full">
            {transactions.map((transaction) => (
              <FuelTransactionRow
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </ul>
        )}
        <div className="divider-full my-4"></div>
        <button className="button-big ">
          {' '}
          <Link href={`/resources/projects/${projectId}/new/`}>
            Add Fuel Transaction
          </Link>
        </button>
      </div>
    </div>
  );
}
