'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';


export default function FuelTransactionsPage(){
  const [ transactions, setTransactions] = useState ([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load (){
      setError(null);
      const {data,error} = await supabase
      .from('fuel_transactions')
      .select('id, type ');

      if (error) setError(error.message);
      setTransactions(data || []);
      setLoading(false);
    }
    load()
  }, []);
  return (
    <div className="main-container">
         <div className="form-header mb-4">
          <h1 className="ml-2">Fuel Transactions</h1>
        </div>
        <ul className="flex flex-col gap-2">
          {transactions.map( (t) => (
            <li className="card-button" key={t.id}>
              <Link href={`/resources/fuel-transactions/${t.id}/page.js`}>{t.type}</Link>
            </li>
          ))}
        </ul>
      
    </div>

  )
}