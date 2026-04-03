'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function FuelTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('fuel_transactions')
        .select('id, type');

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setTransactions(data || []);

      if (!data || data.length === 0) {
        setMessage('No transactions found');
      } else {
        setMessage('');
      }

      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Fuel Transactions</h1>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p>{message}</p>}

      <ul className="flex flex-col gap-2">
        {transactions.map((t) => (
          <li className="card-button" key={t.id}>
            <Link href={`/resources/fuel-transactions/${t.id}`}>{t.type}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
