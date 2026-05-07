'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Gauge,
  ImageIcon,
} from 'lucide-react';
import formatDate from '@/components/FormatDate';
import { supabase } from '@/lib/supabaseClient';
import LoadingIndicator from '@/components/LoadingIndicator';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatLitres(value) {
  const numericValue = toNumber(value);
  return numericValue === null ? 'Missing' : `${numericValue.toFixed(2)} L`;
}

function shortId(value) {
  return value ? `${value.slice(0, 8)}...` : 'N/A';
}

function getEvidenceState(transaction) {
  const beforeReading = toNumber(transaction.before_fuel_level);
  const afterReading = toNumber(transaction.after_fuel_level);
  const hasBeforeEvidence =
    Boolean(transaction.before_photo_url) && beforeReading !== null;
  const hasAfterEvidence =
    Boolean(transaction.after_photo_url) && afterReading !== null;
  const isComplete = hasBeforeEvidence && hasAfterEvidence;
  const rawDifference =
    beforeReading !== null && afterReading !== null
      ? afterReading - beforeReading
      : null;
  const displayedMovement =
    rawDifference === null ? null : Math.abs(rawDifference);
  const isDelivery = transaction.type === 'delivery';
  const directionMatchesReading =
    rawDifference === null ||
    rawDifference === 0 ||
    (isDelivery ? rawDifference > 0 : rawDifference < 0);

  return {
    beforeReading,
    afterReading,
    displayedMovement,
    hasBeforeEvidence,
    hasAfterEvidence,
    isComplete,
    isDelivery,
    directionMatchesReading,
  };
}

function ProofPill({ tone = 'neutral', children }) {
  const tones = {
    complete: 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]',
    warning: 'border-[#fee39f] bg-[#fff7e6] text-[#9a5f12]',
    neutral: 'border-[#d5eefc] bg-[#f5fbff] text-[#62748e]',
  };

  return (
    <p
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </p>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-3">
      {eyebrow && (
        <p className="steps-text uppercase tracking-[0.18em]">{eyebrow}</p>
      )}
      <h2 className="mt-1">{title}</h2>
      {description && <p className="steps-text mt-1">{description}</p>}
    </div>
  );
}

function MeterLine({ label, value, percent, active = false }) {
  return (
    <div className="rounded-2xl border border-[#e8edf3] bg-white/80 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="steps-text">{label}</p>
        <p className="text-sm font-semibold text-[var(--primary-black)]">
          {value}
        </p>
      </div>
      <div className="h-[10px] overflow-hidden rounded-full bg-[#eef4fb]">
        <div
          className={`h-full rounded-full ${
            active
              ? 'bg-gradient-to-r from-[#febd20] to-[#f25822]'
              : 'bg-[#cbdae3]'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function ReceiptHero({
  typeLabel,
  movementLabel,
  movementValue,
  isComplete,
  hasAfterEvidence,
  transactionHref,
  generatorName,
  projectName,
  beforeReading,
  afterReading,
  createdAt,
}) {
  const maxReading = Math.max(beforeReading || 0, afterReading || 0, 1);
  const beforePercent =
    beforeReading === null
      ? 12
      : Math.max(12, Math.min(100, (beforeReading / maxReading) * 100));
  const afterPercent =
    afterReading === null
      ? 12
      : Math.max(12, Math.min(100, (afterReading / maxReading) * 100));

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fee39f] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/45" />
      <div className="pointer-events-none absolute -bottom-24 left-8 h-44 w-44 rounded-full bg-[#ff8a00]/10" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="steps-text uppercase tracking-[0.18em]">{typeLabel}</p>
          <h2 className="mt-2 truncate">{generatorName}</h2>
          <p className="steps-text mt-1 truncate">{projectName}</p>
        </div>
        <ProofPill tone={isComplete ? 'complete' : 'warning'}>
          {isComplete ? 'Complete' : 'Needs after'}
        </ProofPill>
      </div>

      <div className="relative mt-8">
        <p className="steps-text">{movementLabel}</p>
        <p className="mt-1 text-[48px] font-semibold leading-none tracking-[-0.05em] text-[#f25822]">
          {movementValue}
        </p>
        <p className="steps-text mt-2">Started {formatDate(createdAt)}</p>
      </div>

      <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MeterLine
          label="Before meter"
          value={formatLitres(beforeReading)}
          percent={beforePercent}
        />
        <MeterLine
          label="After meter"
          value={formatLitres(afterReading)}
          percent={afterPercent}
          active={hasAfterEvidence}
        />
      </div>

      {!hasAfterEvidence && (
        <Link
          href={`${transactionHref}/after`}
          className="button-big relative mt-5 gap-2 text-white"
        >
          Collect after evidence
          <ArrowRight size={18} />
        </Link>
      )}
    </section>
  );
}

function DetailRow({ label, value, href, copyValue, onCopy }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#edf1f5] py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="steps-text">{label}</p>
        {href ? (
          <Link
            href={href}
            className="mt-1 block truncate text-sm font-semibold text-[var(--primary-black)]"
          >
            {value || 'Missing'}
          </Link>
        ) : (
          <p className="mt-1 truncate text-sm font-semibold text-[var(--primary-black)]">
            {value || 'Missing'}
          </p>
        )}
      </div>

      {copyValue && (
        <button
          type="button"
          onClick={() => onCopy(copyValue)}
          className="circle-btn shrink-0 text-[var(--slate-dark)]"
          title={`Copy ${label}`}
        >
          <Copy size={15} strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}

function EvidenceCard({ title, reading, photoUrl, capturedAt, missingText }) {
  const isCaptured = Boolean(photoUrl) && toNumber(reading) !== null;

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#e8edf3] bg-white shadow-[0_4px_12px_rgba(98,116,142,0.08)]">
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-[var(--primary-black)]">
            {title}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[var(--primary-black)]">
            {formatLitres(reading)}
          </p>
        </div>
        <ProofPill tone={isCaptured ? 'complete' : 'warning'}>
          {isCaptured ? 'Captured' : 'Missing'}
        </ProofPill>
      </div>

      {photoUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={`${title} meter evidence`}
            className="h-56 w-full object-cover"
          />
          {capturedAt && (
            <p className="steps-text flex items-center gap-2 p-4">
              <Clock size={16} />
              {formatDate(capturedAt)}
            </p>
          )}
        </>
      ) : (
        <div className="mx-4 mb-4 flex min-h-40 flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d5eefc] bg-[#f5fbff] p-4 text-center">
          <ImageIcon className="text-[var(--slate-dark)]" size={28} />
          <p className="mt-2 text-sm font-semibold text-[var(--primary-black)]">
            {missingText}
          </p>
        </div>
      )}
    </section>
  );
}

function MovementNote({
  directionMatchesReading,
  hasAfterEvidence,
  movementLabel,
}) {
  if (!hasAfterEvidence) {
    return (
      <div className="rounded-[22px] border border-[#fee39f] bg-[#fff7e6] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#f25822]">
            <Gauge size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--primary-black)]">
              Waiting for final reading
            </p>
            <p className="steps-text mt-1">
              Capture after evidence to lock the {movementLabel.toLowerCase()}{' '}
              total.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!directionMatchesReading) {
    return (
      <div className="rounded-[22px] border border-[#fee39f] bg-[#fff7e6] p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="shrink-0 text-[#b7791f]" size={22} />
          <p className="text-sm text-[#9a5f12]">
            The meter readings do not match the selected transaction type.
            Review the evidence before relying on this total.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-[#d7edce] bg-[#f3fbef] p-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="shrink-0 text-[#2f8f5b]" size={22} />
        <p className="text-sm text-[#2f8f5b]">
          Before and after meter evidence are connected to this transaction.
        </p>
      </div>
    </div>
  );
}

function RecentProjectTransactions({ projectId, currentTransactionId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadRecentTransactions() {
      if (!projectId) return;

      setLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('fuel_transactions')
        .select(
          'id, type, created_at, before_fuel_level, after_fuel_level, after_photo_url'
        )
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        setErrorMessage(error.message);
        setTransactions([]);
      } else {
        setTransactions(data || []);
      }

      setLoading(false);
    }

    loadRecentTransactions();
  }, [projectId]);

  return (
    <section className="rounded-[24px] border border-[#e8edf3] bg-white/80 p-4">
      <SectionTitle
        eyebrow="Project history"
        title="Recent activity"
        description="The last few fuel movements for this project."
      />

      {loading && <LoadingIndicator />}
      {errorMessage && <p className="text-sm text-[#f25822]">{errorMessage}</p>}

      {!loading && !errorMessage && transactions.length === 0 && (
        <p className="steps-text">
          No other transactions found for this project.
        </p>
      )}

      {!loading && !errorMessage && transactions.length > 0 && (
        <div className="divide-y divide-[#edf1f5]">
          {transactions.map((item) => {
            const before = toNumber(item.before_fuel_level);
            const after = toNumber(item.after_fuel_level);
            const isComplete = Boolean(item.after_photo_url) && after !== null;
            const movement =
              before !== null && after !== null
                ? Math.abs(after - before)
                : null;
            const prefix = item.type === 'delivery' ? '+' : '-';
            const isCurrent = item.id === currentTransactionId;

            return (
              <Link
                key={item.id}
                href={`/resources/fuel-transactions/${item.id}`}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--primary-black)]">
                    {item.type === 'delivery' ? 'Fuel delivery' : 'Fuel return'}
                    {isCurrent ? ' · current' : ''}
                  </p>
                  <p className="steps-text mt-1">
                    {formatDate(item.created_at)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-[var(--primary-black)]">
                    {movement === null
                      ? 'Pending'
                      : `${prefix}${movement.toFixed(2)} L`}
                  </p>
                  <p className="steps-text mt-1">
                    {isComplete ? 'Complete' : 'Needs after'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function FuelTransactionDetail({ transaction }) {
  const {
    beforeReading,
    afterReading,
    displayedMovement,
    hasAfterEvidence,
    isComplete,
    isDelivery,
    directionMatchesReading,
  } = getEvidenceState(transaction);

  async function copyToClipboard(value) {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  const typeLabel = isDelivery ? 'Fuel delivery' : 'Fuel return';
  const movementLabel = isDelivery ? 'Delivered fuel' : 'Returned fuel';
  const movementPrefix = isDelivery ? '+' : '-';
  const projectId = transaction.project_id;
  const transactionHref = `/resources/projects/${projectId}/transactions/${transaction.id}`;
  const movementValue =
    displayedMovement === null
      ? 'Pending'
      : `${movementPrefix}${displayedMovement.toFixed(2)} L`;
  const generatorName =
    transaction.generators?.name || shortId(transaction.generator_id);
  const projectName = transaction.projects?.name || shortId(projectId);

  return (
    <div className="space-y-5">
      <ReceiptHero
        typeLabel={typeLabel}
        movementLabel={movementLabel}
        movementValue={movementValue}
        isComplete={isComplete}
        hasAfterEvidence={hasAfterEvidence}
        transactionHref={transactionHref}
        generatorName={generatorName}
        projectName={projectName}
        beforeReading={beforeReading}
        afterReading={afterReading}
        createdAt={transaction.created_at}
      />

      <MovementNote
        directionMatchesReading={directionMatchesReading}
        hasAfterEvidence={hasAfterEvidence}
        movementLabel={movementLabel}
      />

      <section>
        <SectionTitle
          eyebrow="Proof"
          title="Meter evidence"
          description="The two readings that make this transaction auditable."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <EvidenceCard
            title={`Before ${isDelivery ? 'delivery' : 'return'}`}
            reading={beforeReading}
            photoUrl={transaction.before_photo_url}
            capturedAt={transaction.created_at}
            missingText="Before meter evidence is missing."
          />
          <EvidenceCard
            title={`After ${isDelivery ? 'delivery' : 'return'}`}
            reading={afterReading}
            photoUrl={transaction.after_photo_url}
            capturedAt={transaction.completed_at}
            missingText="After meter evidence still needs to be captured."
          />
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e8edf3] bg-white/80 p-4">
        <SectionTitle
          eyebrow="Records"
          title="Linked details"
          description="Quiet admin references for this fuel movement."
        />
        <div>
          <DetailRow label="Transaction type" value={typeLabel} />
          <DetailRow
            label="Status"
            value={isComplete ? 'Complete' : 'Awaiting after evidence'}
          />
          <DetailRow
            label="External tank"
            value={transaction.tanks?.name || shortId(transaction.tank_id)}
          />
          <DetailRow
            label="Created"
            value={formatDate(transaction.created_at)}
          />
          <DetailRow
            label="Completed"
            value={
              isComplete ? formatDate(transaction.completed_at) : 'Pending'
            }
          />
          <DetailRow
            label="Transaction ID"
            value={shortId(transaction.id)}
            copyValue={transaction.id}
            onCopy={copyToClipboard}
          />
          <DetailRow
            label="Project"
            value={projectName}
            href={`/resources/projects/${projectId}`}
            copyValue={projectId}
            onCopy={copyToClipboard}
          />
          <DetailRow
            label="Generator"
            value={generatorName}
            href="/resources/generators"
            copyValue={transaction.generator_id}
            onCopy={copyToClipboard}
          />
          <DetailRow
            label="Tank"
            value={transaction.tanks?.name || shortId(transaction.tank_id)}
            href="/resources/external-tanks"
            copyValue={transaction.tank_id}
            onCopy={copyToClipboard}
          />
          <DetailRow
            label="Technician"
            value={shortId(transaction.technician_id)}
            href={`/resources/technician/${transaction.technician_id}`}
            copyValue={transaction.technician_id}
            onCopy={copyToClipboard}
          />
        </div>
      </section>

      <RecentProjectTransactions
        projectId={projectId}
        currentTransactionId={transaction.id}
      />

      <Link
        href={`/resources/reports/fuel-transactions/${transaction.id}`}
        className="form-button w-full justify-center gap-2"
      >
        <FileText size={18} />
        Open transaction report
      </Link>
    </div>
  );
}
