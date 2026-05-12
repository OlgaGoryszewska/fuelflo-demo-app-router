'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoice_id');

  return (
    <main className="mx-auto w-full max-w-[860px] px-3 py-10">
      <div className="rounded-[28px] border border-[#d7edce] bg-[#f3fbef] p-10 text-center shadow-[0_12px_30px_rgba(46,124,91,0.08)]">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">Payment complete</h1>
        <p className="mt-4 text-sm text-slate-600">
          Thank you. Your card payment has been processed successfully.
        </p>
        {invoiceId && (
          <p className="mt-2 text-sm text-slate-700">
            Invoice ID: <span className="font-semibold">{invoiceId}</span>
          </p>
        )}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/resources/payments"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#d5eefc] bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-[#f8fbff]"
          >
            <ArrowLeft size={16} /> Back to payments
          </Link>
          <Link
            href="/resources/financial-transactions"
            className="inline-flex items-center gap-2 rounded-2xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            View invoice ledger
          </Link>
        </div>
      </div>
    </main>
  );
}
