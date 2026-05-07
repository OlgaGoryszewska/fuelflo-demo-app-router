'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import FuelTransactionsList from '@/components/fuel-transaction/fuel-transaction-list.js';

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
        .select('id, type, created_at, before_fuel_level, after_fuel_level')
        .eq('type', 'delivery')
        .order('created_at', { ascending: false });
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
    <div className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Fuel transactions</p>
      </div>

      <div className="background-container">
        <div className="mb-4">
          <h2>Fuel deliveries</h2>
          <p className="steps-text mt-1">
            Review recent fuel transaction dates and volumes.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="steps-text">Loading transactions...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {message && !loading && !error && (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="steps-text">{message}</p>
          </div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <FuelTransactionsList transactions={transactions} />
        )}
      </div>
    </div>
  );
}
