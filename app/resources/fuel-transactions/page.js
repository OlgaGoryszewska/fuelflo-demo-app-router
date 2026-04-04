'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';

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
        .select(
          'id, type, created_at, before_fuel_level, after_fuel_level');

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
  function formatDate(dateValue) {
    if (!dateValue) return '-';

    return new Date(dateValue).toLocaleString('en-GB', {
      year: '2-digit',
      month: 'short',
      day: '2-digit',
 
    });
  }
  const beforeFuel = Number(transactions.before_fuel_level) || 0;
  const afterFuel = Number(transactions.after_fuel_level) || 0;
  const difference = Math.abs(afterFuel - beforeFuel);
  const sign = transactions.type === 'delivery' ? '+' : '-';
  


  return (
    <div className="main-container">
      <div className="form-header ">
        <h1 className="ml-2">Fuel Transactions</h1>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p>{message}</p>}
   
      <div className="generator-container mb-4">
        <div className="form-header-with-button ">
          <BoltOutlinedIcon />
          <h3 className="ml-2 uppercase">Fuel Transactions</h3>
        </div>
        <div className='divider-full '></div>

        <div className="flex flex-col items-center align-center ">
          <div className="background-header p-0">
            <p>Date</p>
            <p>Vol</p>
          </div>
         
      <ul className="flex flex-col gap-2 w-full">
        {transactions.map((t) => (
          <li className=" file-row "  key={t.id}>
            
            <Link href={`/resources/fuel-transactions/${t.id}`}>{formatDate(t. created_at)} {sign} {difference.toFixed(2)} L</Link>
          </li>
        ))}
      </ul>
        </div>
      </div>
    </div>
  );
}
