'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, CreditCard, ReceiptText, Search } from 'lucide-react';
import LoadingIndicator from '@/components/LoadingIndicator';
import { supabase } from '@/lib/supabaseClient';

const SELECT_QUERY = `
  id,
  invoice_number,
  status,
  amount_due,
  amount_paid,
  currency,
  due_date,
  contractor_id,
  contractor_role,
  contractor_name,
  contractor_email,
  projects(id,name)
`;

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

function getStatusClass(status) {
  const classes = {
    draft: 'border-[#e8edf3] bg-[#f8fbff] text-[#62748e]',
    sent: 'border-[#fee39f] bg-[#fff7e6] text-[#9a5f12]',
    paid: 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]',
    overdue: 'border-red-200 bg-red-50 text-red-700',
  };

  return classes[status] || classes.draft;
}

export default function PaymentsPage() {
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInvoices() {
      setLoading(true);
      setError('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('Please sign in to view your invoices.');
        setInvoices([]);
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        setError('Unable to load your profile.');
        setInvoices([]);
        setLoading(false);
        return;
      }

      let invoiceQuery = supabase
        .from('financial_transactions')
        .select(SELECT_QUERY)
        .order('created_at', { ascending: false });

      if (['event_organizer', 'fuel_supplier'].includes(profile.role)) {
        invoiceQuery = invoiceQuery
          .eq('contractor_id', user.id)
          .eq('contractor_role', profile.role);
      }

      const { data, error } = await invoiceQuery;

      if (error) {
        setError(error.message);
        setInvoices([]);
      } else {
        setInvoices(data || []);
      }

      setLoading(false);
    }

    loadInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return invoices;

    return invoices.filter((invoice) => {
      const haystack = [
        invoice.invoice_number,
        invoice.status,
        invoice.contractor_name,
        invoice.contractor_email,
        invoice.projects?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [query, invoices]);

  const summary = useMemo(() => {
    return invoices.reduce(
      (totals, invoice) => {
        const due = toNumber(invoice.amount_due);
        const paid = toNumber(invoice.amount_paid);
        totals.totalDue += due;
        totals.totalPaid += paid;
        totals.totalOutstanding += Math.max(due - paid, 0);
        if (invoice.status === 'paid') totals.paid += 1;
        return totals;
      },
      { totalDue: 0, totalPaid: 0, totalOutstanding: 0, paid: 0 }
    );
  }, [invoices]);

  return (
    <main className="mx-auto w-full max-w-[860px] px-3 py-6">
      <div className="mb-6 rounded-[28px] border border-[#e8edf3] bg-white p-6 shadow-[0_12px_30px_rgba(98,116,142,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="steps-text uppercase tracking-[0.18em] text-slate-500">Payments</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Invoice payments</h1>
            <p className="steps-text mt-2 text-slate-600">
              Review outstanding invoices and pay directly from the app.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-[#f5fbff] px-4 py-2 text-sm font-semibold text-slate-700">
            <CreditCard size={18} /> Online payment ready
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-[28px] border border-[#e8edf3] bg-[#f8fbff] p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[22px] border border-[#e8edf3] bg-white p-4">
            <p className="text-sm font-semibold text-slate-600">Total due</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatMoney(summary.totalDue)}
            </p>
          </div>
          <div className="rounded-[22px] border border-[#e8edf3] bg-white p-4">
            <p className="text-sm font-semibold text-slate-600">Total paid</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatMoney(summary.totalPaid)}
            </p>
          </div>
          <div className="rounded-[22px] border border-[#e8edf3] bg-white p-4">
            <p className="text-sm font-semibold text-slate-600">Outstanding</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatMoney(summary.totalOutstanding)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa8b6]" size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search invoice, contractor, project"
            className="!h-12 !w-full !rounded-[22px] !border !border-[#e8edf3] !bg-white !px-12 !text-sm !text-slate-900 !outline-none focus:!border-slate-400"
          />
        </label>
      </div>

      {loading && <LoadingIndicator />}
      {error && (
        <div className="mb-4 rounded-[22px] border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && filteredInvoices.length === 0 && (
        <div className="rounded-[22px] border border-[#e8edf3] bg-white p-4 text-sm text-slate-700">
          No invoices found. Create a financial transaction first or search by invoice number.
        </div>
      )}

      <ul className="grid gap-4">
        {filteredInvoices.map((invoice) => {
          const outstanding = Math.max(
            toNumber(invoice.amount_due) - toNumber(invoice.amount_paid),
            0
          );

          return (
            <li key={invoice.id} className="rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{invoice.invoice_number || 'Invoice'}</p>
                  <p className="steps-text mt-1 text-slate-600">
                    {invoice.projects?.name || 'No project'} • {invoice.contractor_name || 'No payer'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(invoice.status)}`}>
                    {invoice.status}
                  </span>
                  <span className="text-sm text-slate-600">
                    Due {formatDate(invoice.due_date)}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[18px] border border-[#e8edf3] bg-[#f8fbff] p-3">
                  <p className="steps-text text-slate-500">Amount due</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatMoney(invoice.amount_due, invoice.currency)}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[#e8edf3] bg-[#f8fbff] p-3">
                  <p className="steps-text text-slate-500">Outstanding</p>
                  <p className="mt-1 text-sm font-semibold text-[#9a5f12]">
                    {formatMoney(outstanding, invoice.currency)}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[#e8edf3] bg-[#f8fbff] p-3">
                  <p className="steps-text text-slate-500">Paid</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatMoney(invoice.amount_paid, invoice.currency)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {outstanding > 0 && invoice.status !== 'paid' ? (
                  <Link
                    href={`/resources/payments/${invoice.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d5eefc] bg-white px-4 py-2 text-sm font-semibold text-[#62748e] hover:bg-[#f8fbff]"
                  >
                    <ArrowRight size={16} />
                    Pay invoice
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#d7edce] bg-[#f3fbef] px-4 py-2 text-sm font-semibold text-[#2f8f5b]">
                    <CheckCircle2 size={16} />
                    Paid
                  </span>
                )}
                <Link
                  href="/resources/financial-transactions"
                  className="inline-flex items-center gap-2 rounded-full border border-[#e8edf3] bg-white px-4 py-2 text-sm font-semibold text-[#62748e] hover:bg-[#f8fbff]"
                >
                  <ReceiptText size={16} />
                  View ledger
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
