'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Fuel,
  Gauge,
  RotateCcw,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import TransactionReportPreview from '@/components/reports/TransactionReportPreview';
import LoadingIndicator from '@/components/LoadingIndicator';

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

  if (loading) {
    return <LoadingIndicator />;
  }

  if (errorMessage) {
    return (
      <main className="mx-auto w-full max-w-[760px] px-3 py-4">
        <div className="rounded-[24px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
          Error: {errorMessage}
        </div>
      </main>
    );
  }

  if (!transaction) {
    return (
      <main className="mx-auto w-full max-w-[760px] px-3 py-4">
        <div className="rounded-[24px] border border-[#e8edf3] bg-white p-4">
          <p className="steps-text">No transaction found.</p>
        </div>
      </main>
    );
  }

  const beforeFuel = Number(transaction.before_fuel_level) || 0;
  const afterFuel = Number(transaction.after_fuel_level) || 0;
  const difference = Math.abs(afterFuel - beforeFuel);
  const sign = transaction.type === 'delivery' ? '+' : '-';
  const isDelivery = transaction.type === 'delivery';
  const TypeIcon = isDelivery ? Fuel : RotateCcw;
  const isReady = Boolean(transaction.after_photo_url);

  return (
    <main className="mx-auto w-full max-w-[860px] px-3 py-4">
      <Link
        href="/resources/reports/fuel-transactions"
        className="mb-3 inline-flex h-10 items-center gap-2 rounded-full border border-[#d5eefc] bg-white px-3 text-sm font-semibold text-[#62748e] shadow-sm transition active:scale-[0.98]"
      >
        <ArrowLeft size={16} strokeWidth={2.3} />
        Back
      </Link>

      <div className="mb-3 px-1">
        <p className="page-kicker">Transaction report</p>
      </div>

      <section className="mb-4 rounded-[28px] border border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fee39f] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">
              Single fuel report
            </p>
            <h2 className="mt-2 truncate">
              {transaction.projects?.name || 'Fuel transaction'}
            </h2>
            <p className="steps-text mt-1">
              {isDelivery ? 'Delivery' : 'Return'} •{' '}
              {transaction.generators?.name ||
                transaction.tanks?.name ||
                'Unassigned asset'}
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#f25822] ring-1 ring-white">
            <TypeIcon size={23} strokeWidth={2.4} />
          </span>
        </div>
      </section>

      <section className="background-container-white mb-4">
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-[20px] border border-[#e8edf3] bg-[#f8fbff] p-3">
            <p className="steps-text flex items-center gap-2">
              <Gauge size={16} />
              Fuel movement
            </p>
            <p
              className={`mt-1 text-xl font-semibold ${
                isDelivery ? 'text-[#f25822]' : 'text-[#62748e]'
              }`}
            >
              {sign}
              {difference.toFixed(2)} L
            </p>
          </div>
          <div
            className={`rounded-[20px] border p-3 ${
              isReady
                ? 'border-[#d7edce] bg-[#f3fbef]'
                : 'border-[#fee39f] bg-[#fff7e6]'
            }`}
          >
            <p className="steps-text flex items-center gap-2">
              {isReady ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              Report status
            </p>
            <p
              className={`mt-1 text-xl font-semibold ${
                isReady ? 'text-[#2f8f5b]' : 'text-[#9a5f12]'
              }`}
            >
              {isReady ? 'Ready' : 'Needs evidence'}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="page-kicker">PDF preview</p>
          <h2 className="mt-1">Fuel transaction report</h2>
        </div>
        <TransactionReportPreview transaction={transaction} />
      </section>
    </main>
  );
}
