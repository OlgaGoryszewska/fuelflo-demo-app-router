'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Link from 'next/link';
import Image from 'next/image';
import avatar from '@/public/avatar.png';
import TransactionReportPreview from '@/components/reports/TransactionReportPreview';

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
        <h1 className="ml-2">Fuel Transaction Report</h1>
      </div>

      <div className="background-container">
        <TransactionReportPreview transaction={transaction} />
      </div>
    </div>
  );
}
