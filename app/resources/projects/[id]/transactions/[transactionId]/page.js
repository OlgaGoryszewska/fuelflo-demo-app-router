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

  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Transaction Details</h1>
        <p>Project ID from route: {id}</p>
        <p>Transaction ID from route: {transactionId}</p>
      </div>

      {transaction && (
        <div className="transaction-card">
          <p><strong>ID:</strong> {transaction.id}</p>
          <p><strong>Created at:</strong> {transaction.created_at}</p>
          <p><strong>Type:</strong> {transaction.type}</p>
          <p><strong>Status:</strong> {transaction.status}</p>
          <p><strong>Project ID:</strong> {transaction.project_id}</p>
          <p><strong>Generator ID:</strong> {transaction.generator_id}</p>
          <p><strong>Technician ID:</strong> {transaction.technician_id}</p>
          <p><strong>Completed at:</strong> {transaction.completed_at}</p>
          <p><strong>Before fuel level:</strong> {transaction.before_fuel_level}</p>
          <p><strong>After fuel level:</strong> {transaction.after_fuel_level}</p>
          <p><strong>Tank ID:</strong> {transaction.tank_id}</p>

          {transaction.before_photo_url && (
            <img src={transaction.before_photo_url} alt="Before fuel" width="250" />
          )}

          {transaction.after_photo_url && (
            <img src={transaction.after_photo_url} alt="After fuel" width="250" />
          )}
        </div>
      )}
    </div>
  );
}