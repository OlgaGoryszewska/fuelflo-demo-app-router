'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Link from 'next/link';

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
        .select(
          `
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
        `
        )
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
  const sign = transaction.type === 'delivery' ? '+' : '-';

  const shortId = (id) => (id ? `${id.slice(0, 8)}...` : 'N/A');

  async function copyToClipboard(value) {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Transaction Details</h1>
      </div>

      <div className="background-container">
        <h2>Fuel {transaction.type}</h2>

        <h4>Starting fuel level</h4>
        <div className="fuel-bar-before"></div>
        <p className=" nr-middle text-right"> {beforeFuel} L</p>
        <div className="divider-full"></div>
        <h4>Ending fuel level</h4>
        <div className="fuel-bar"></div>
        <p className="nr-middle text-right"> {afterFuel} L</p>
        <div className="divider-full"></div>
        <div className="nr-container mb-2">
          <h4 className="pt-2 pl-2">Difference </h4>
          <p className="nr-big">
            {' '}
            {sign} {deliveredFuel.toFixed(2)} L
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="container-flex ">
            <h4>Created</h4>

            <p className="steps-text">
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
          </div>

          <div className="container-flex ">
            <h4>Completed</h4>

            <p className="steps-text">
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
        </div>

        <div className="container-flex">
            <div className='flex flex-row justify-between align-middle'>
            <p className="h-mid-gray-s">Project</p> <button
            onClick={() => copyToClipboard(id)}
            className="circle-btn"
            title="Copy ID"
          >
            <ContentCopyIcon fontSize="small" className="text-slate-600" />
          </button>
            </div>
      

          <p className="steps-text mb-2">{shortId(id)}</p>
          <Link  className='' href={`/resources/projects/${id}`}>Open </Link>
         
          <div className="divider-full mb-2"></div>
          <div className='flex flex-row justify-between align-middle'><p className="h-mid-gray-s">Transaction </p> <button
            onClick={() => copyToClipboard(id)}
            className="circle-btn"
            title="Copy ID"
          >
            <ContentCopyIcon fontSize="small" className="text-slate-600" />
          </button></div>
          
          <p className="steps-text mb-2"> {shortId(transactionId)}</p>
          <div className="divider-full mb-2"></div>
          <div className='flex flex-row justify-between align-middle'>
          <p className="h-mid-gray-s">Generator</p>
          <button
            onClick={() => copyToClipboard(id)}
            className="circle-btn"
            title="Copy ID"
          >
            <ContentCopyIcon fontSize="small" className="text-slate-600" />
          </button>
          </div>
          <p className="steps-text mb-2">{shortId(transaction.generator_id)}</p>
          <div className="divider-full mb-2"></div>
          <div className='flex flex-row justify-between align-middle'>
          <p className="h-mid-gray-s">Tank</p>
          <button
            onClick={() => copyToClipboard(id)}
            className="circle-btn"
            title="Copy ID"
          >
            <ContentCopyIcon fontSize="small" className="text-slate-600" />
          </button>
          </div>
          <p className="steps-text mb-2">{shortId(transaction.tank_id)}</p>
          <div className="divider-full mb-2"></div>
          <div className='flex flex-row justify-between align-middle'>
          <p className="h-mid-gray-s">Technician </p>
          <button
            onClick={() => copyToClipboard(id)}
            className="circle-btn"
            title="Copy ID"
          >
            <ContentCopyIcon fontSize="small" className="text-slate-600" />
          </button>
          </div>
          <p className="steps-text mb-2">
            {shortId(transaction.technician_id)}
          </p>
          <div className="divider-full mb-2"></div>
        </div>

        <button className="button-big"> Generate report</button>
        <button className="button-big"> Generate factura</button>

        {transaction.before_photo_url && (
          <img
            src={transaction.before_photo_url}
            alt="Before fuel"
            width="250"
          />
        )}

        {transaction.after_photo_url && (
          <img src={transaction.after_photo_url} alt="After fuel" width="250" />
        )}
      </div>
    </div>
  );
}
