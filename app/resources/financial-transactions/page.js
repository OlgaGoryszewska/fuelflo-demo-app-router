'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  BadgeCent,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Mail,
  ReceiptText,
  Search,
  Send,
} from 'lucide-react';
import LoadingIndicator from '@/components/LoadingIndicator';
import ProfileRoleDropdown from '@/components/dropdowns/ProfileRoleDropdown';
import { supabase } from '@/lib/supabaseClient';

const FINANCIAL_SELECT = `
  id,
  project_id,
  invoice_number,
  type,
  status,
  contractor_id,
  contractor_role,
  contractor_name,
  contractor_email,
  amount_due,
  amount_paid,
  currency,
  issued_at,
  due_date,
  sent_at,
  paid_at,
  notes,
  projects (
    id,
    name
  )
`;

const PROJECT_SELECT = `
  id,
  name,
  contractor_name,
  company_name,
  email,
  expected_liters,
  selling_price
`;

const defaultForm = {
  project_id: '',
  invoice_number: '',
  contractor_id: '',
  contractor_role: '',
  contractor_name: '',
  contractor_email: '',
  amount_due: '',
  currency: 'SAR',
  due_date: '',
  notes: '',
};

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
    cancelled: 'border-[#e8edf3] bg-white text-[#717887]',
  };

  return classes[status] || classes.draft;
}

function getInvoiceEmailHref(transaction) {
  const email = transaction.contractor_email;
  if (!email) return '';

  const subject = encodeURIComponent(
    `Faktura ${transaction.invoice_number || ''}`.trim()
  );
  const body = encodeURIComponent(
    [
      `Hello ${transaction.contractor_name || ''},`,
      '',
      `Please find faktura ${transaction.invoice_number} for ${formatMoney(
        transaction.amount_due,
        transaction.currency
      )}.`,
      `Project: ${transaction.projects?.name || 'Not assigned'}`,
      `Due date: ${formatDate(transaction.due_date)}`,
      '',
      'Thank you,',
      'FuelFlo',
    ].join('\n')
  );

  return `mailto:${email}?subject=${subject}&body=${body}`;
}

function SummaryCard({ icon: Icon, label, value, hint, tone = 'slate' }) {
  const tones = {
    orange: 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]',
    green: 'bg-[#f3fbef] text-[#2f8f5b] ring-[#d7edce]',
    amber: 'bg-[#fff7e6] text-[#9a5f12] ring-[#fee39f]',
    slate: 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]',
  };

  return (
    <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4 shadow-[0_4px_12px_rgba(98,116,142,0.06)]">
      <span
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ring-1 ${tones[tone]}`}
      >
        <Icon size={20} strokeWidth={2.3} />
      </span>
      <p className="text-xl font-semibold text-[var(--primary-black)]">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#62748e]">{label}</p>
      {hint && <p className="steps-text mt-1">{hint}</p>}
    </div>
  );
}

function FinancialRow({ transaction, onMarkSent, onMarkPaid }) {
  const outstanding =
    toNumber(transaction.amount_due) - toNumber(transaction.amount_paid);
  const emailHref = getInvoiceEmailHref(transaction);

  return (
    <li className="rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)]">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff7e6] text-[#f25822] ring-1 ring-[#fee39f]">
          <ReceiptText size={21} strokeWidth={2.3} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--primary-black)]">
                {transaction.invoice_number}
              </p>
              <p className="steps-text mt-1 truncate">
                {transaction.projects?.name || 'No project'} •{' '}
                {transaction.contractor_name || 'No contractor'}
                {transaction.contractor_role ? ` (${transaction.contractor_role.replace('_', ' ')})` : ''}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                transaction.status
              )}`}
            >
              {transaction.status}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-[18px] border border-[#e8edf3] bg-[#f8fbff] p-3">
              <p className="steps-text">Due</p>
              <p className="mt-1 text-sm font-semibold text-[var(--primary-black)]">
                {formatMoney(transaction.amount_due, transaction.currency)}
              </p>
            </div>
            <div className="rounded-[18px] border border-[#e8edf3] bg-[#f8fbff] p-3">
              <p className="steps-text">Outstanding</p>
              <p className="mt-1 text-sm font-semibold text-[#9a5f12]">
                {formatMoney(outstanding, transaction.currency)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f5fbff] px-3 py-1 text-xs font-semibold text-[#62748e]">
              <CalendarDays size={13} />
              Due {formatDate(transaction.due_date)}
            </span>

            {emailHref && (
              <Link
                href={emailHref}
                onClick={() => onMarkSent(transaction)}
                className="inline-flex items-center gap-1 rounded-full border border-[#d5eefc] bg-white px-3 py-1 text-xs font-semibold text-[#62748e]"
              >
                <Mail size={13} />
                Email faktura
              </Link>
            )}

            {transaction.status === 'draft' && (
              <button
                type="button"
                onClick={() => onMarkSent(transaction)}
                className="inline-flex items-center gap-1 rounded-full border border-[#fee39f] bg-[#fff7e6] px-3 py-1 text-xs font-semibold text-[#9a5f12]"
              >
                <Send size={13} />
                Mark sent
              </button>
            )}

            {transaction.status !== 'paid' && (
              <>
                <Link
                  href={`/resources/payments/${transaction.id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-[#d5eefc] bg-white px-3 py-1 text-xs font-semibold text-[#62748e] hover:bg-[#f8fbff]"
                >
                  <CreditCard size={13} />
                  Pay now
                </Link>
                <button
                  type="button"
                  onClick={() => onMarkPaid(transaction)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#d7edce] bg-[#f3fbef] px-3 py-1 text-xs font-semibold text-[#2f8f5b]"
                >
                  <CheckCircle2 size={13} />
                  Mark paid
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function FinancialTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadFinancialData() {
    setLoading(true);
    setError('');

    const [transactionResult, projectResult] = await Promise.all([
      supabase
        .from('financial_transactions')
        .select(FINANCIAL_SELECT)
        .order('created_at', { ascending: false }),
      supabase
        .from('projects')
        .select(PROJECT_SELECT)
        .order('start_date', { ascending: false }),
    ]);

    if (transactionResult.error) {
      setError(
        `${transactionResult.error.message}. Run supabase/financial_transactions.sql in Supabase if this is the first setup.`
      );
      setTransactions([]);
    } else {
      setTransactions(transactionResult.data || []);
    }

    if (!projectResult.error) {
      setProjects(projectResult.data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadFinancialData();
  }, []);

  const summary = useMemo(() => {
    return transactions.reduce(
      (totals, transaction) => {
        const due = toNumber(transaction.amount_due);
        const paid = toNumber(transaction.amount_paid);

        totals.totalDue += due;
        totals.totalPaid += paid;
        totals.outstanding += Math.max(due - paid, 0);

        if (transaction.status === 'sent') totals.sent += 1;
        if (transaction.status === 'paid') totals.paid += 1;
        if (transaction.status === 'overdue') totals.overdue += 1;

        return totals;
      },
      {
        totalDue: 0,
        totalPaid: 0,
        outstanding: 0,
        sent: 0,
        paid: 0,
        overdue: 0,
      }
    );
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    if (!searchText) return transactions;

    return transactions.filter((transaction) => {
      const haystack = [
        transaction.invoice_number,
        transaction.status,
        transaction.contractor_name,
        transaction.contractor_email,
        transaction.contractor_role,
        transaction.projects?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchText);
    });
  }, [query, transactions]);

  function updateForm(field, value) {
    setMessage('');
    setError('');
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleProjectChange(projectId) {
    const project = projects.find((item) => String(item.id) === projectId);
    const estimatedAmount =
      toNumber(project?.expected_liters) * toNumber(project?.selling_price);

    setForm((current) => ({
      ...current,
      project_id: projectId,
      contractor_name:
        current.contractor_id && current.contractor_name
          ? current.contractor_name
          : project?.contractor_name || project?.company_name || current.contractor_name,
      contractor_email:
        current.contractor_id && current.contractor_email
          ? current.contractor_email
          : project?.email || current.contractor_email,
      amount_due: estimatedAmount > 0 ? estimatedAmount.toFixed(2) : current.amount_due,
    }));
  }

  function handleContractorSelect(profile) {
    setForm((current) => ({
      ...current,
      contractor_id: profile?.id || '',
      contractor_role: profile?.role || '',
      contractor_name: profile?.full_name || current.contractor_name,
      contractor_email: profile?.email || current.contractor_email,
    }));
  }

  async function handleCreateTransaction(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('You must be signed in to create a faktura.');
      }

      if (!form.invoice_number || !form.amount_due) {
        throw new Error('Invoice number and amount are required.');
      }

      const { error } = await supabase.from('financial_transactions').insert({
        project_id: form.project_id || null,
        invoice_number: form.invoice_number,
        type: 'invoice',
        status: 'draft',
        contractor_id: form.contractor_id || null,
        contractor_role: form.contractor_role || null,
        contractor_name: form.contractor_name || null,
        contractor_email: form.contractor_email || null,
        amount_due: toNumber(form.amount_due),
        amount_paid: 0,
        currency: form.currency || 'SAR',
        due_date: form.due_date || null,
        notes: form.notes || null,
        created_by: user.id,
      });

      if (error) throw error;

      setForm(defaultForm);
      setMessage('Faktura saved as draft.');
      await loadFinancialData();
    } catch (err) {
      setError(err.message || 'Could not save financial transaction.');
    } finally {
      setSaving(false);
    }
  }

  async function updateTransactionStatus(transaction, status) {
    setError('');
    setMessage('');

    const updates = {
      status,
    };

    if (status === 'sent') {
      updates.sent_at = new Date().toISOString();
    }

    if (status === 'paid') {
      updates.amount_paid = toNumber(transaction.amount_due);
      updates.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('financial_transactions')
      .update(updates)
      .eq('id', transaction.id);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(status === 'paid' ? 'Marked as paid.' : 'Marked as sent.');
    await loadFinancialData();
  }

  return (
    <main className="mx-auto w-full max-w-[860px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Finance</p>
      </div>

      <section className="mb-4 rounded-[28px] border border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fee39f] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">
              Financial control
            </p>
            <h2 className="mt-2">Financial transactions</h2>
            <p className="steps-text mt-1 max-w-[560px]">
              Track fakturas, contractor billing, payment status, and outstanding
              project money in one place.
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#f25822] ring-1 ring-white">
            <ReceiptText size={23} strokeWidth={2.4} />
          </span>
        </div>
      </section>

      <section className="mb-4 rounded-[28px] border border-[#e8edf3] bg-white p-5 shadow-[0_10px_30px_rgba(98,116,142,0.08)]">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard
            icon={BadgeCent}
            label="Outstanding"
            value={formatMoney(summary.outstanding)}
            tone="amber"
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Paid"
            value={formatMoney(summary.totalPaid)}
            tone="green"
          />
          <SummaryCard
            icon={Send}
            label="Sent"
            value={summary.sent}
            hint="Awaiting payment"
            tone="orange"
          />
          <SummaryCard
            icon={Clock3}
            label="Overdue"
            value={summary.overdue}
            tone={summary.overdue > 0 ? 'amber' : 'slate'}
          />
        </div>
      </section>

      <section className="mb-4 rounded-[28px] border border-[#e8edf3] bg-white p-5 shadow-[0_10px_30px_rgba(98,116,142,0.08)]">
        <div className="mb-5">
          <p className="page-kicker">Create faktura</p>
          <h2 className="mt-1">New financial transaction</h2>
          <p className="steps-text mt-1">
            Save a draft, email the contractor, then track sent and paid status.
          </p>
        </div>

        <form
          className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
          onSubmit={handleCreateTransaction}
        >
          <label>
            Project
            <select
              value={form.project_id}
              onChange={(event) => handleProjectChange(event.target.value)}
            >
              <option value="">No project selected</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name || `Project ${project.id}`}
                </option>
              ))}
            </select>
          </label>

          <label>
            Invoice number
            <input
              value={form.invoice_number}
              onChange={(event) => updateForm('invoice_number', event.target.value)}
              placeholder="FF-2026-001"
            />
          </label>

          <label>
            Contractor
            <ProfileRoleDropdown
              value={form.contractor_id}
              roles={['event_organizer', 'fuel_supplier']}
              placeholder="Choose event organizer or fuel supplier"
              onChange={handleContractorSelect}
            />
          </label>

          <label>
            Contractor name
            <input
              value={form.contractor_name}
              onChange={(event) => updateForm('contractor_name', event.target.value)}
              placeholder="Contractor name"
            />
          </label>

          <label>
            Contractor email
            <input
              type="email"
              value={form.contractor_email}
              onChange={(event) => updateForm('contractor_email', event.target.value)}
              placeholder="contractor@example.com"
            />
          </label>

          <label>
            Amount
            <input
              inputMode="decimal"
              value={form.amount_due}
              onChange={(event) => updateForm('amount_due', event.target.value)}
              placeholder="0.00"
            />
          </label>

          <label>
            Due date
            <input
              type="date"
              value={form.due_date}
              onChange={(event) => updateForm('due_date', event.target.value)}
            />
          </label>

          <label className="md:col-span-2">
            Notes
            <textarea
              value={form.notes}
              onChange={(event) => updateForm('notes', event.target.value)}
              placeholder="Payment terms, contractor reference, or internal note"
              className="min-h-24 w-full rounded-[10px] border border-[var(--primary-gray-light)] bg-white p-3 text-base text-[var(--slate-dark)]"
            />
          </label>

          <div className="md:col-span-2">
            <button type="submit" disabled={saving} className="button-big gap-2">
              <ReceiptText size={18} />
              {saving ? 'Saving...' : 'Save faktura'}
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-3 rounded-[22px] border border-[#d7edce] bg-[#f3fbef] p-4 text-sm font-semibold text-[#2f8f5b]">
            {message}
          </div>
        )}
      </section>

      <section className="mb-4 rounded-[28px] border border-[#e8edf3] bg-white p-5 shadow-[0_10px_30px_rgba(98,116,142,0.08)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="page-kicker">Ledger</p>
            <h2 className="mt-1">Faktura tracking</h2>
          </div>
          <span className="rounded-full bg-[#f5fbff] px-3 py-1 text-sm font-semibold text-[#62748e]">
            {transactions.length}
          </span>
        </div>

        <label className="relative mb-4 block">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa8b6]"
            size={17}
            strokeWidth={2.2}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search faktura, contractor, project"
            className="!h-12 !pl-12 !pr-4"
          />
        </label>

        {loading && <LoadingIndicator />}

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-[22px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredTransactions.length === 0 && (
          <div className="rounded-[22px] border border-[#e8edf3] bg-white p-4">
            <p className="text-sm font-semibold text-[var(--primary-black)]">
              No financial transactions yet.
            </p>
            <p className="steps-text mt-1">
              Create the first faktura to start tracking contractor billing.
            </p>
          </div>
        )}

        {!loading && !error && filteredTransactions.length > 0 && (
          <ul className="grid grid-cols-1 gap-3">
            {filteredTransactions.map((transaction) => (
              <FinancialRow
                key={transaction.id}
                transaction={transaction}
                onMarkSent={(item) => updateTransactionStatus(item, 'sent')}
                onMarkPaid={(item) => updateTransactionStatus(item, 'paid')}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
