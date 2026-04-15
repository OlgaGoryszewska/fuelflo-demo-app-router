'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Link from 'next/link';
import Image from 'next/image';
import avatar from '@/public/avatar.png';

export default function TransactionDetailPage() {
  const params = useParams();
  const { id } = params;

  const [transaction, setTransaction] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransaction() {
      if (!id) return;

      setErrorMessage('');
      console.log(id);

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
          tank_id,
          generators (
            id,
            name
          ),
            tanks (
            id,
            name),
            projects (
            id,
            name)
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        setErrorMessage(error.message);
        setTransaction(null);
      } else {
        setTransaction(data);
      }

      setLoading(false);
    }

    fetchTransaction();
  }, [id]);

  async function copyToClipboard(value) {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  function shortId(value) {
    return value ? `${value.slice(0, 8)}...` : 'N/A';
  }

  function formatDate(dateValue) {
    if (!dateValue) return '-';

    return new Date(dateValue).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

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
  const difference = Math.abs(afterFuel - beforeFuel);
  const sign = transaction.type === 'delivery' ? '+' : '-';

  return (
    <div className="main-container">
      <div className="form-header">
        <h1 className="ml-2">Transaction Details</h1>
      </div>

      <div className="background-container">
        <h2>Fuel {transaction.type}</h2>

        <div className="flex flex-row justify-between items-center">
          <p className="h-mid-gray-s">Transaction</p>
          <button
            onClick={() => copyToClipboard(transaction.id)}
            className="circle-btn"
            title="Copy transaction ID"
            type="button"
          >
            <ContentCopyIcon fontSize="small" className="text-slate-600" />
          </button>
        </div>

        <p className="steps-text mb-2">{shortId(transaction.id)}</p>
        <div className="divider-full mb-2"></div>

        <h4>Starting fuel level</h4>
        <div className="fuel-bar-before"></div>
        <p className="nr-middle text-right">{beforeFuel} L</p>
        <div className="divider-full"></div>

        <h4>Ending fuel level</h4>
        <div className="fuel-bar"></div>
        <p className="nr-middle text-right">{afterFuel} L</p>
        <div className="divider-full"></div>

        <div className="nr-container mb-2">
          <h4 className="pt-2 pl-2">Difference</h4>
          <p className="nr-big">
            {sign} {difference.toFixed(2)} L
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="container-flex">
            <h4>Created</h4>
            <p className="steps-text">{formatDate(transaction.created_at)}</p>
          </div>

          <div className="container-flex">
            <h4>Completed</h4>
            <p className="steps-text">{formatDate(transaction.completed_at)}</p>
          </div>
        </div>

        <div className="container-flex">
          <div className="flex flex-row justify-between items-center">
            <Image src={avatar} alt="avatar" className="avatar" />
            <button
              onClick={() => copyToClipboard(transaction.technician_id)}
              className="circle-btn"
              title="Copy technician ID"
              type="button"
            >
              <ContentCopyIcon fontSize="small" className="text-slate-600" />
            </button>
          </div>

          <p className="h-mid-gray-s">Technician</p>
          <p className="steps-text mb-2">
            {shortId(transaction.technician_id)}
          </p>
          <Link
            className="underline-link"
            href={`/resources/technicians/${transaction.technician_id}`}
          >
            Open
          </Link>
        </div>

        <div className="container-flex">
          <div className="flex flex-row justify-between items-center">
            <p className="h-mid-gray-s">Project</p>
            <button
              onClick={() => copyToClipboard(transaction.project_id)}
              className="circle-btn"
              title="Copy project ID"
              type="button"
            >
              <ContentCopyIcon fontSize="small" className="text-slate-600" />
            </button>
          </div>

          <p className="steps-text mb-2">
            {transaction.projects?.name || shortId(transaction.project_id)}
          </p>
          <Link
            className="underline-link"
            href={`/resources/projects/${transaction.project_id}`}
          >
            Open
          </Link>

          <div className="divider-full mb-2"></div>

          <div className="flex flex-row justify-between items-center">
            <p className="h-mid-gray-s">Generator</p>
            <button
              onClick={() => copyToClipboard(transaction.generator_id)}
              className="circle-btn"
              title="Copy generator ID"
              type="button"
            >
              <ContentCopyIcon fontSize="small" className="text-slate-600" />
            </button>
          </div>

          <p className="steps-text mb-2">
            {transaction.generators?.name || shortId(transaction.generator_id)}
          </p>
          <Link
            className="underline-link"
            href={`/resources/generators/${transaction.generator_id}`}
          >
            Open
          </Link>

          <div className="divider-full mb-2"></div>

          <div className="flex flex-row justify-between items-center">
            <p className="h-mid-gray-s">Tank</p>
            <button
              onClick={() => copyToClipboard(transaction.tank_id)}
              className="circle-btn"
              title="Copy tank ID"
              type="button"
            >
              <ContentCopyIcon fontSize="small" className="text-slate-600" />
            </button>
          </div>

          <p className="steps-text mb-2">
            {transaction.tanks?.name || shortId(transaction.tank_id)}
          </p>
          <Link
            className="underline-link"
            href={`/resources/tanks/${transaction.tank_id}`}
          >
            Open
          </Link>
        </div>
        <div className="container-flex">
          <h4 className="mb-2">Transaction files</h4>

          {transaction.before_photo_url && (
            <img
              src={transaction.before_photo_url}
              alt="Before fuel"
              width="250"
              className="window"
            />
          )}
          <p className="steps-text mb-2">Image taken before transaction</p>

          {transaction.after_photo_url && (
            <img
              src={transaction.after_photo_url}
              alt="After fuel"
              width="250"
              className="window"
            />
          )}
          <p className="steps-text mb-2">Image taken after transaction</p>
        </div>
      </div>
    </div>
  );
}
