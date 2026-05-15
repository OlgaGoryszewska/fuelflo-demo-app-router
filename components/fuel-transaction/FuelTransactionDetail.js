'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  Database,
  FileText,
  Gauge,
  HardDrive,
  ImageIcon,
  Link as LinkIcon,
  MapPin,
  ShieldCheck,
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

function compactValue(value) {
  if (value === null || value === undefined || value === '') return 'Missing';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string' && value.length > 42) {
    return `${value.slice(0, 42)}...`;
  }

  return String(value);
}

function titleizeKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getFileName(url) {
  if (!url) return 'Missing';

  try {
    const parsedUrl = new URL(url);
    return decodeURIComponent(parsedUrl.pathname.split('/').pop() || url);
  } catch {
    return String(url).split('/').pop() || String(url);
  }
}

function formatLocation(location) {
  if (!location?.latitude || !location?.longitude) return 'Missing';

  return `${Number(location.latitude).toFixed(6)}, ${Number(
    location.longitude
  ).toFixed(6)}`;
}

function formatAccuracy(location) {
  if (!location?.accuracy_meters) return 'Accuracy missing';

  return `±${Math.round(location.accuracy_meters)} m`;
}

function getMapHref(location) {
  if (!location?.latitude || !location?.longitude) return '';

  return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
}

function getContextValue(context, key, fallback = 'Missing') {
  return context?.[key] === null ||
    context?.[key] === undefined ||
    context?.[key] === ''
    ? fallback
    : String(context[key]);
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

function getScalarMetadata(transaction) {
  const hiddenKeys = new Set(['generators', 'tanks', 'projects']);
  const renderedKeys = new Set([
    'id',
    'type',
    'status',
    'project_id',
    'created_by',
    'generator_id',
    'tank_id',
    'technician_id',
    'created_at',
    'completed_at',
    'before_fuel_level',
    'after_fuel_level',
    'before_photo_url',
    'after_photo_url',
    'before_photo_preview',
    'after_photo_preview',
    'before_location',
    'after_location',
    'before_captured_at',
    'after_captured_at',
    'before_photo_sha256',
    'after_photo_sha256',
    'before_capture_context',
    'after_capture_context',
    'sync_status',
    'remote_saved_at',
  ]);

  return Object.entries(transaction)
    .filter(([key, value]) => {
      if (hiddenKeys.has(key)) return false;
      if (renderedKeys.has(key)) return false;
      if (typeof File !== 'undefined' && value instanceof File) return false;
      return typeof value !== 'object' || value === null;
    })
    .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey));
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
  canEditTransaction,
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

      {!hasAfterEvidence && canEditTransaction && (
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

function MetadataStat({ icon: Icon, label, value, tone = 'slate' }) {
  const tones = {
    orange: 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]',
    green: 'bg-[#f3fbef] text-[#2f8f5b] ring-[#d7edce]',
    amber: 'bg-[#fff7e6] text-[#9a5f12] ring-[#fee39f]',
    slate: 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]',
  };

  return (
    <div className="rounded-[20px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.06)]">
      <span
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ring-1 ${tones[tone]}`}
      >
        <Icon size={19} strokeWidth={2.3} />
      </span>
      <p className="text-lg font-semibold text-[var(--primary-black)]">
        {value}
      </p>
      <p className="steps-text mt-1">{label}</p>
    </div>
  );
}

function ChecklistItem({ complete, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-[18px] border border-[#e8edf3] bg-[#f8fbff] p-3">
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          complete ? 'bg-[#f3fbef] text-[#2f8f5b]' : 'bg-[#fff7e6] text-[#9a5f12]'
        }`}
      >
        {complete ? (
          <CheckCircle2 size={16} strokeWidth={2.4} />
        ) : (
          <AlertTriangle size={16} strokeWidth={2.4} />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[var(--primary-black)]">
          {label}
        </span>
        <span className="steps-text mt-0.5 block truncate">{value}</span>
      </span>
    </div>
  );
}

function MetadataGroup({ title, icon: Icon, children }) {
  return (
    <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e]">
          <Icon size={16} strokeWidth={2.3} />
        </span>
        <p className="text-sm font-semibold text-[var(--primary-black)]">
          {title}
        </p>
      </div>
      <div className="divide-y divide-[#edf1f5]">{children}</div>
    </div>
  );
}

function RawMetadataDrawer({ entries, onCopy }) {
  return (
    <details className="rounded-[22px] border border-[#d5eefc] bg-[#f5fbff] p-4">
      <summary className="cursor-pointer text-sm font-semibold text-[var(--primary-black)]">
        Raw transaction metadata
      </summary>
      <div className="mt-3 divide-y divide-[#d5eefc]">
        {entries.map(([key, value]) => (
          <DetailRow
            key={key}
            label={titleizeKey(key)}
            value={compactValue(value)}
            copyValue={value === null || value === undefined ? '' : String(value)}
            onCopy={onCopy}
          />
        ))}
      </div>
    </details>
  );
}

function EvidenceMetadataSection({
  transaction,
  typeLabel,
  movementLabel,
  movementValue,
  projectName,
  generatorName,
  projectId,
  beforeReading,
  afterReading,
  displayedMovement,
  isComplete,
  hasBeforeEvidence,
  hasAfterEvidence,
  directionMatchesReading,
  onCopy,
}) {
  const metadataEntries = getScalarMetadata(transaction);
  const tankName = transaction.tanks?.name || transaction.tank_name || shortId(transaction.tank_id);
  const technicianName =
    transaction.technician?.full_name ||
    transaction.technicians?.full_name ||
    transaction.profiles?.full_name ||
    shortId(transaction.technician_id);
  const creatorName =
    transaction.creator?.full_name ||
    transaction.creator?.email ||
    shortId(transaction.created_by || transaction.technician_id);
  const hasBeforeLocation = Boolean(transaction.before_location?.latitude);
  const hasAfterLocation = Boolean(transaction.after_location?.latitude);
  const hasHashes = Boolean(
    transaction.before_photo_sha256 &&
      (!hasAfterEvidence || transaction.after_photo_sha256)
  );
  const evidenceScore = [
    hasBeforeEvidence,
    hasAfterEvidence,
    hasBeforeLocation,
    !hasAfterEvidence || hasAfterLocation,
    hasHashes,
    directionMatchesReading,
    Boolean(transaction.project_id),
    Boolean(transaction.generator_id),
    Boolean(transaction.tank_id),
    Boolean(transaction.technician_id),
  ].filter(Boolean).length;
  const evidencePercent = Math.round((evidenceScore / 10) * 100);
  const beforePhotoLabel = getFileName(transaction.before_photo_url || transaction.before_photo_preview);
  const afterPhotoLabel = getFileName(transaction.after_photo_url || transaction.after_photo_preview);

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#d5eefc] bg-white shadow-[0_12px_30px_rgba(98,116,142,0.12)]">
      <div className="bg-gradient-to-br from-[#f8fbff] via-white to-[#fff7e6] p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">
              Evidence metadata
            </p>
            <h2 className="mt-1">Delivery and return audit trail</h2>
            <p className="steps-text mt-1 max-w-[560px]">
              One reviewed section for identity, readings, photos, timestamps,
              assignment, and source records.
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#62748e] ring-1 ring-[#d5eefc]">
            <ShieldCheck size={23} strokeWidth={2.4} />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetadataStat
            icon={ClipboardCheck}
            label="Evidence strength"
            value={`${evidencePercent}%`}
            tone={isComplete && directionMatchesReading ? 'green' : 'amber'}
          />
          <MetadataStat
            icon={Gauge}
            label={movementLabel}
            value={movementValue}
            tone={transaction.type === 'delivery' ? 'orange' : 'slate'}
          />
          <MetadataStat
            icon={MapPin}
            label="GPS proof"
            value={`${[hasBeforeLocation, hasAfterLocation].filter(Boolean).length}/2`}
            tone={hasBeforeLocation && (!hasAfterEvidence || hasAfterLocation) ? 'green' : 'amber'}
          />
          <MetadataStat
            icon={Database}
            label="Extra fields"
            value={metadataEntries.length}
          />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ChecklistItem
            complete={hasBeforeEvidence}
            label="Before evidence"
            value={`${formatLitres(beforeReading)} • ${beforePhotoLabel}`}
          />
          <ChecklistItem
            complete={hasAfterEvidence}
            label="After evidence"
            value={`${formatLitres(afterReading)} • ${afterPhotoLabel}`}
          />
          <ChecklistItem
            complete={hasBeforeLocation}
            label="Before location"
            value={`${formatLocation(transaction.before_location)} • ${formatAccuracy(
              transaction.before_location
            )}`}
          />
          <ChecklistItem
            complete={!hasAfterEvidence || hasAfterLocation}
            label="After location"
            value={`${formatLocation(transaction.after_location)} • ${formatAccuracy(
              transaction.after_location
            )}`}
          />
          <ChecklistItem
            complete={directionMatchesReading}
            label="Reading direction"
            value={
              directionMatchesReading
                ? `${typeLabel} direction matches readings`
                : 'Readings conflict with transaction type'
            }
          />
          <ChecklistItem
            complete={hasHashes}
            label="Photo hash"
            value={
              transaction.before_photo_sha256
                ? `Before ${transaction.before_photo_sha256.slice(0, 12)}...`
                : 'Missing SHA-256'
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MetadataGroup title="Operational assignment" icon={LinkIcon}>
            <DetailRow label="Transaction type" value={typeLabel} />
            <DetailRow label="Status" value={transaction.status || 'Missing'} />
            <DetailRow
              label="Project"
              value={projectName}
              href={projectId ? `/resources/projects/${projectId}` : undefined}
              copyValue={projectId}
              onCopy={onCopy}
            />
            <DetailRow
              label="Generator"
              value={generatorName}
              href="/resources/generators"
              copyValue={transaction.generator_id}
              onCopy={onCopy}
            />
            <DetailRow
              label="External tank"
              value={tankName}
              href="/resources/external-tanks"
              copyValue={transaction.tank_id}
              onCopy={onCopy}
            />
            <DetailRow
              label="Created by"
              value={creatorName}
              href={
                transaction.created_by
                  ? `/resources/technician/${transaction.created_by}`
                  : undefined
              }
              copyValue={transaction.created_by}
              onCopy={onCopy}
            />
            <DetailRow
              label="Technician"
              value={technicianName}
              href={
                transaction.technician_id
                  ? `/resources/technician/${transaction.technician_id}`
                  : undefined
              }
              copyValue={transaction.technician_id}
              onCopy={onCopy}
            />
          </MetadataGroup>

          <MetadataGroup title="Timeline and capture" icon={CalendarDays}>
            <DetailRow label="Created" value={formatDate(transaction.created_at)} />
            <DetailRow
              label="Completed"
              value={isComplete ? formatDate(transaction.completed_at) : 'Pending'}
            />
            <DetailRow
              label="Before photo"
              value={beforePhotoLabel}
              href={transaction.before_photo_url}
              copyValue={transaction.before_photo_url}
              onCopy={onCopy}
            />
            <DetailRow
              label="Before GPS"
              value={`${formatLocation(transaction.before_location)} • ${formatAccuracy(
                transaction.before_location
              )}`}
              href={getMapHref(transaction.before_location)}
              copyValue={formatLocation(transaction.before_location)}
              onCopy={onCopy}
            />
            <DetailRow
              label="Before captured"
              value={
                transaction.before_captured_at
                  ? formatDate(transaction.before_captured_at)
                  : 'Not recorded'
              }
            />
            <DetailRow
              label="Before SHA-256"
              value={compactValue(transaction.before_photo_sha256)}
              copyValue={transaction.before_photo_sha256}
              onCopy={onCopy}
            />
            <DetailRow
              label="After photo"
              value={afterPhotoLabel}
              href={transaction.after_photo_url}
              copyValue={transaction.after_photo_url}
              onCopy={onCopy}
            />
            <DetailRow
              label="After GPS"
              value={`${formatLocation(transaction.after_location)} • ${formatAccuracy(
                transaction.after_location
              )}`}
              href={getMapHref(transaction.after_location)}
              copyValue={formatLocation(transaction.after_location)}
              onCopy={onCopy}
            />
            <DetailRow
              label="After captured"
              value={
                transaction.after_captured_at
                  ? formatDate(transaction.after_captured_at)
                  : 'Not recorded'
              }
            />
            <DetailRow
              label="After SHA-256"
              value={compactValue(transaction.after_photo_sha256)}
              copyValue={transaction.after_photo_sha256}
              onCopy={onCopy}
            />
            <DetailRow
              label="Sync status"
              value={transaction.sync_status || transaction.status || 'Remote'}
            />
            <DetailRow
              label="Remote saved"
              value={
                transaction.remote_saved_at
                  ? formatDate(transaction.remote_saved_at)
                  : 'Not recorded'
              }
            />
          </MetadataGroup>
        </div>

        <MetadataGroup title="Capture environment" icon={ShieldCheck}>
          <DetailRow
            label="Before permission"
            value={getContextValue(
              transaction.before_capture_context,
              'geolocation_permission_state'
            )}
          />
          <DetailRow
            label="Before secure capture"
            value={
              transaction.before_capture_context?.secure_context
                ? 'HTTPS secure context'
                : 'Not confirmed'
            }
          />
          <DetailRow
            label="Before timezone"
            value={getContextValue(transaction.before_capture_context, 'timezone')}
          />
          <DetailRow
            label="After permission"
            value={getContextValue(
              transaction.after_capture_context,
              'geolocation_permission_state',
              hasAfterEvidence ? 'Missing' : 'Pending'
            )}
          />
          <DetailRow
            label="After secure capture"
            value={
              transaction.after_capture_context?.secure_context
                ? 'HTTPS secure context'
                : hasAfterEvidence
                  ? 'Not confirmed'
                  : 'Pending'
            }
          />
          <DetailRow
            label="Device/browser"
            value={
              transaction.before_capture_context?.platform ||
              transaction.after_capture_context?.platform ||
              'Not recorded'
            }
          />
        </MetadataGroup>

        <MetadataGroup title="Record identity" icon={HardDrive}>
          <DetailRow
            label="Transaction ID"
            value={shortId(transaction.id)}
            copyValue={transaction.id}
            onCopy={onCopy}
          />
          <DetailRow
            label="Project ID"
            value={shortId(transaction.project_id)}
            copyValue={transaction.project_id}
            onCopy={onCopy}
          />
          <DetailRow
            label="Generator ID"
            value={shortId(transaction.generator_id)}
            copyValue={transaction.generator_id}
            onCopy={onCopy}
          />
          <DetailRow
            label="Tank ID"
            value={shortId(transaction.tank_id)}
            copyValue={transaction.tank_id}
            onCopy={onCopy}
          />
          <DetailRow
            label="Created by ID"
            value={shortId(transaction.created_by)}
            copyValue={transaction.created_by}
            onCopy={onCopy}
          />
          <DetailRow
            label="Technician ID"
            value={shortId(transaction.technician_id)}
            copyValue={transaction.technician_id}
            onCopy={onCopy}
          />
        </MetadataGroup>

        {metadataEntries.length > 0 && (
          <RawMetadataDrawer entries={metadataEntries} onCopy={onCopy} />
        )}
      </div>
    </section>
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

function FieldNotesSection({ transaction }) {
  const notes = [
    {
      label: 'Transaction note',
      value: transaction.operator_note,
    },
    {
      label: 'Completion note',
      value: transaction.after_note,
    },
    {
      label: 'Review note',
      value: transaction.review_note,
    },
  ].filter((item) => item.value);

  if (notes.length === 0) return null;

  return (
    <section>
      <SectionTitle
        eyebrow="Notes"
        title="Field notes"
        description="Operator context saved with this transaction."
      />
      <div className="rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)]">
        {notes.map((note) => (
          <div
            key={note.label}
            className="border-b border-[#edf1f5] py-3 first:pt-0 last:border-b-0 last:pb-0"
          >
            <p className="steps-text">{note.label}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm font-semibold text-[var(--primary-black)]">
              {note.value}
            </p>
          </div>
        ))}
      </div>
    </section>
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

export default function FuelTransactionDetail({
  transaction,
  canEditTransaction = false,
}) {
  const {
    beforeReading,
    afterReading,
    displayedMovement,
    hasBeforeEvidence,
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
        canEditTransaction={canEditTransaction}
      />

      <MovementNote
        directionMatchesReading={directionMatchesReading}
        hasAfterEvidence={hasAfterEvidence}
        movementLabel={movementLabel}
      />

      <FieldNotesSection transaction={transaction} />

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

      <EvidenceMetadataSection
        transaction={transaction}
        typeLabel={typeLabel}
        movementLabel={movementLabel}
        movementValue={movementValue}
        projectName={projectName}
        generatorName={generatorName}
        projectId={projectId}
        beforeReading={beforeReading}
        afterReading={afterReading}
        displayedMovement={displayedMovement}
        isComplete={isComplete}
        hasBeforeEvidence={hasBeforeEvidence}
        hasAfterEvidence={hasAfterEvidence}
        directionMatchesReading={directionMatchesReading}
        onCopy={copyToClipboard}
      />

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
