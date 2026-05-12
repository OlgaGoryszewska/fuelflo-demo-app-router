'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function CancelPage() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoice_id');

  return (
    <main className="mx-auto w-full max-w-[860px] px-3 py-10">
      <div className="rounded-[28px] border border-[#fee39f] bg-[#fff7e6] p-10 text-center shadow-[0_12px_30px_rgba(170,118,12,0.12)]">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">Payment canceled</h1>
        <p className="mt-4 text-sm text-slate-600">
          The payment was not completed. You can try again or return to the invoice list.
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
            href={`/resources/payments/${invoiceId}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Retry payment
          </Link>
        </div>
      </div>
    </main>
  );
}
