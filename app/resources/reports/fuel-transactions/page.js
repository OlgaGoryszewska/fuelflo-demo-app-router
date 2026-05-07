'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import FuelTransactionsListReport from '@/components/fuel-transaction/FuelTransactionListReport';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function RaportFuelTransactionsPage() {
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
    <div className="main-container">
      {loading && <LoadingIndicator />}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p>{message}</p>}

      {!loading && !error && transactions.length > 0 && (
        <div className="background-container">
          <h2>Choose a fuel transaction</h2>
          <p className="steps-text ">To generate a report </p>
          <div className="divider-full mb-2"></div>
          <FuelTransactionsListReport transactions={transactions} />
        </div>
      )}
    </div>
  );
}
