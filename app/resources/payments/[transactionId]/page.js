'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, ShieldCheck, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import LoadingIndicator from '@/components/LoadingIndicator';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value, currency = 'SAR') {
  return `${toNumber(value).toFixed(2)} ${currency || 'SAR'}`;
}

function formatDate(value) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export default function PaymentPage() {
  const { transactionId } = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');

  const outstanding = useMemo(() => {
    if (!transaction) return 0;
    return Math.max(toNumber(transaction.amount_due) - toNumber(transaction.amount_paid), 0);
  }, [transaction]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');
      setMessage('');

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError('Please sign in to access payment details.');
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        setError('Unable to load user role.');
        setLoading(false);
        return;
      }

      const allowedRoles = ['event_organizer', 'fuel_supplier'];
      if (!allowedRoles.includes(profile.role)) {
        setError('You do not have permission to pay invoices.');
        setLoading(false);
        return;
      }

      const { data, error: transactionError } = await supabase
        .from('financial_transactions')
        .select(
          `id, project_id, invoice_number, contractor_name, amount_due, amount_paid, currency, due_date, status, notes, paid_at, projects(id,name)`
        )
        .eq('id', transactionId)
        .single();

      if (transactionError || !data) {
        setError('Payment record not found.');
        setLoading(false);
        return;
      }

      setTransaction(data);
      setPayerName(data.contractor_name || '');
      setPayerEmail(data.contractor_email || '');
      setLoading(false);
    }

    if (transactionId) {
      loadData();
    }
  }, [transactionId]);

  async function handlePay(event) {
    event.preventDefault();
    setError('');

    if (!transaction) return;
    if (!payerName.trim()) {
      setError('Enter payer name.');
      return;
    }
    if (!payerEmail.trim()) {
      setError('Enter payer email.');
      return;
    }
    if (outstanding <= 0) {
      setError('Nothing remains to pay for this invoice.');
      return;
    }

    setSending(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error('Unable to confirm session. Please sign in again.');
      }

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ transaction_id: transaction.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Could not create checkout session.');
      }

      if (!result.url) {
        throw new Error('Missing checkout URL.');
      }

      window.location.href = result.url;
    } catch (err) {
      setError(err.message || 'Could not process payment.');
      setSending(false);
    }
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <main className="mx-auto w-full max-w-[860px] px-3 py-6">
      <div className="mb-4 flex items-center gap-3 text-sm text-slate-600">
        <Link href="/resources/payments" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
          <ArrowLeft size={16} /> Back to payments
        </Link>
      </div>

      <div className="rounded-[28px] border border-[#e8edf3] bg-white p-6 shadow-[0_12px_30px_rgba(98,116,142,0.08)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="steps-text uppercase tracking-[0.18em] text-slate-500">
              Online payment
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Pay invoice {transaction.invoice_number}
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
            <Wallet size={18} />
            {transaction.status === 'paid' ? 'Paid' : 'Pending payment'}
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-[22px] border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-[22px] border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6 mt-8">
          <div className="rounded-[26px] border border-[#e8edf3] bg-[#f8fbff] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Invoice details
            </p>
            <dl className="mt-4 space-y-3 text-sm text-slate-700">
              <div>
                <dt className="font-semibold">Invoice</dt>
                <dd>{transaction.invoice_number || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-semibold">Project</dt>
                <dd>{transaction.projects?.name || 'Unassigned'}</dd>
              </div>
              <div>
                <dt className="font-semibold">Payer</dt>
                <dd>{payerName || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="font-semibold">Due date</dt>
                <dd>{formatDate(transaction.due_date)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[26px] border border-[#e8edf3] bg-white p-5 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Amount due
            </p>
            <div className="mt-4 flex items-end gap-6">
              <div>
                <p className="text-4xl font-semibold text-slate-900">
                  {formatMoney(outstanding || transaction.amount_due, transaction.currency)}
                </p>
                <p className="steps-text mt-1 text-slate-500">
                  {transaction.status === 'paid' ? 'Paid in full' : 'Outstanding amount'}
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
                Total {formatMoney(transaction.amount_due, transaction.currency)}
              </span>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handlePay}>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Payer name</span>
              <input
                type="text"
                value={payerName}
                onChange={(event) => setPayerName(event.target.value)}
                placeholder="Enter your name"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Payer email</span>
              <input
                type="email"
                value={payerEmail}
                onChange={(event) => setPayerEmail(event.target.value)}
                placeholder="name@example.com"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </label>
          </div>

          <div className="rounded-[26px] border border-[#e8edf3] bg-[#f6f9ff] p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white p-3 text-slate-700">
                <CreditCard size={20} />
              </span>
              <div>
                <p className="font-semibold text-slate-900">Card payment</p>
                <p className="steps-text text-slate-500">Stripe will securely process your card payment.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-[#e8edf3] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-100 p-3 text-slate-700">
                <ShieldCheck size={20} />
              </span>
              <div>
                <p className="font-semibold text-slate-900">Secure payment</p>
                <p className="steps-text text-slate-500">Stripe checkout protects card details and handles authorization.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={sending || transaction.status === 'paid'}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d5eefc] bg-[#eef4fb] px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#dbeaf5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? 'Redirecting to Stripe...' : transaction.status === 'paid' ? 'Invoice paid' : 'Pay with card'}
            <CreditCard size={18} />
          </button>
        </form>
      </div>
    </main>
  );
}
