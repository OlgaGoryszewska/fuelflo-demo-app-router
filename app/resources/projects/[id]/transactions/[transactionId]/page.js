'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import FuelTransactionDetail from '@/components/fuel-transaction/FuelTransactionDetail';
import LoadingIndicator from '@/components/LoadingIndicator';
import { getOfflineTransaction } from '@/lib/offline/offlineDb';
import { getCurrentProfileRole } from '@/lib/auth/currentProfileRole';

const TRANSACTION_EDIT_ROLES = new Set(['manager', 'hire_desk']);

const TRANSACTION_SELECT = `
  *,
  generators (
    id,
    name
  ),
  tanks (
    id,
    name
  ),
  projects (
    id,
    name
  ),
  creator:profiles!fuel_transactions_created_by_fkey (
    id,
    full_name,
    email,
    role
  ),
  technician:profiles!fuel_transactions_technician_id_fkey (
    id,
    full_name,
    email,
    role
  )
`;

function createPhotoPreviewUrl(file) {
  if (!file) return '';

  return URL.createObjectURL(file);
}

function mapLocalTransaction(localTransaction) {
  if (!localTransaction) return null;

  return {
    ...localTransaction,
    before_photo_url:
      localTransaction.before_photo_url ||
      createPhotoPreviewUrl(localTransaction.before_photo_file),
    after_photo_url:
      localTransaction.after_photo_url ||
      createPhotoPreviewUrl(localTransaction.after_photo_file),
    generators: localTransaction.generator_name
      ? {
          id: localTransaction.generator_id,
          name: localTransaction.generator_name,
        }
      : null,
    tanks: localTransaction.tank_name
      ? {
          id: localTransaction.tank_id,
          name: localTransaction.tank_name,
        }
      : null,
    projects: null,
  };
}

export default function ProjectTransactionDetailPage() {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransaction() {
      if (!transactionId) return;

      setLoading(true);
      setErrorMessage('');

      const [currentRole, localTransaction] = await Promise.all([
        getCurrentProfileRole(),
        getOfflineTransaction(transactionId),
      ]);

      setRole(currentRole);

      if (!navigator.onLine && localTransaction) {
        setTransaction(mapLocalTransaction(localTransaction));
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('fuel_transactions')
        .select(TRANSACTION_SELECT)
        .eq('id', transactionId)
        .single();

      if (error) {
        if (localTransaction) {
          setTransaction(mapLocalTransaction(localTransaction));
          setErrorMessage('');
        } else {
          setErrorMessage(error.message);
          setTransaction(null);
        }
      } else {
        setTransaction(data);
      }

      setLoading(false);
    }

    fetchTransaction();
  }, [transactionId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-3 py-4">
        <div className="rounded-[24px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
          Error: {errorMessage}
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-3 py-4">
        <div className="rounded-[24px] border border-[#e8edf3] bg-white/80 p-4 text-sm text-[var(--primary-mid-gray)]">
          No transaction found.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Transaction details</p>
      </div>

      <FuelTransactionDetail
        transaction={transaction}
        canEditTransaction={TRANSACTION_EDIT_ROLES.has(role)}
      />
    </div>
  );
}
