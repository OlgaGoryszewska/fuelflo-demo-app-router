'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function TransactionDetailPage() {
  const params = useParams();
  const { id, transactionId } = params;

  const [transaction, setTransaction] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransaction() {
      if (!transactionId) return;

      setLoading(true);

      const { data, error } = await supabase
        .from('fuel_transactions')
        .select(`
          id,
          created_at,
          type,
          status,
          project_id,
          generator_id,
          technician_id,
          completed_at,
          before_fuel_level,
          after_fuel_level,
          before_photo_url,
          after_photo_url,
          tank_id
        `)
        .eq('id', transactionId)
        .single();

      if (error) {
        setErrorMessage(error.message);
        setTransaction(null);
      } else {
        setTransaction(data);
        setErrorMessage('');
      }

      setLoading(false);
    }

    fetchTransaction();
  }, [transactionId]);

  if (loading) {
    return <div className="main-container">Loading transaction...</div>;
  }

  if (errorMessage) {
    return <div className="main-container">Error: {errorMessage}</div>;
  }

  if (!transaction) {
    return <div className="main-container">No transaction found.</div>;
  }

  const beforeFuel = Number(transaction.before_fuel_level) || 0;
  const afterFuel = Number(transaction.after_fuel_level) || 0;
  const deliveredFuel = afterFuel - beforeFuel;

  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Transaction Details</h1>
      </div>

      <div className="background-container">
      <h2>Fuel  {' '}{transaction.type}</h2>
        <div className='window flex-col' >
        <p className='pt-2 pl-2'>Delivered fuel </p>
        <div className='divider-full'></div>
        <p className='text-4xl m-auto'> + {deliveredFuel.toFixed(2)} L</p></div>
      
      <p className='h-mid-gray-s'>Starting fuel level</p>
              <div className="fuel-bar"></div>
              <p className="generator-localisation text-right"> {beforeFuel} L</p>
              <div className='divider-full'></div>
              <p className='h-mid-gray-s'>Ending fuel level</p>
              <div className="fuel-bar"></div>
              <p className="generator-localisation text-right"> {afterFuel} L</p>
              <div className='divider-full'></div>
        <div className='grid grid-cols-2'>
        <p className='h-mid-gray-s'>
          Created {' '}
        </p>
        <p className='h-mid-gray-s'>
          Completed {' '}
        </p>
        
        <p className='steps-text'>
          
          {transaction.created_at
            ? new Date(transaction.created_at).toLocaleString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'}
        </p>
        
       
        <p className='steps-text'>
          {transaction.completed_at
            ? new Date(transaction.completed_at).toLocaleString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'}
        </p>
        </div>
        <div className='divider-full'></div>
        
        <p><strong>Project ID:</strong> {id}</p>
        <p><strong>Transaction ID:</strong> {transactionId}</p>
        <p><strong>Generator ID:</strong> {transaction.generator_id}</p>
        <p><strong>Tank ID:</strong> {transaction.tank_id}</p>
        <p><strong>Technician ID:</strong> {transaction.technician_id}</p>
   
        
        
       

        {transaction.before_photo_url && (
          <img
            src={transaction.before_photo_url}
            alt="Before fuel"
            width="250"
          />
        )}

        {transaction.after_photo_url && (
          <img
            src={transaction.after_photo_url}
            alt="After fuel"
            width="250"
          />
        )}
      </div>
    </div>
  );
}