'use client';

import { Camera, CheckCircle2, Gauge, MapPin, ShieldCheck } from 'lucide-react';
import {
  TransactionFieldCard,
  TransactionReviewRow,
  TransactionStepHeader,
} from './TransactionUi';

export default function ReviewAfter({ formData }) {
  return (
    <div className="space-y-4">
      <TransactionStepHeader
        eyebrow="Review evidence"
        title="Review after transaction"
        description="Check the final evidence before closing the transaction."
      />

      <TransactionFieldCard
        icon={Gauge}
        title="Final meter reading"
        description="This reading is paired with the before reading in the transaction report."
      >
        <div className="rounded-2xl border border-gray-100 bg-white px-3">
          <TransactionReviewRow
            label="After meter reading"
            value={formData.after_fuel_level}
          />
          <TransactionReviewRow
            label="Completion note"
            value={formData.after_note}
          />
          <TransactionReviewRow
            label="GPS evidence"
            value={
              formData.after_location
                ? `${formData.after_location.latitude.toFixed(6)}, ${formData.after_location.longitude.toFixed(6)}`
                : 'Not captured'
            }
          />
          <TransactionReviewRow
            label="GPS accuracy"
            value={
              formData.after_location?.accuracy_meters
                ? `${Math.round(formData.after_location.accuracy_meters)} m`
                : formData.after_location_error || 'Missing'
            }
          />
          <TransactionReviewRow
            label="Photo SHA-256"
            value={
              formData.after_photo_sha256
                ? `${formData.after_photo_sha256.slice(0, 12)}...`
                : 'Not calculated'
            }
          />
        </div>
      </TransactionFieldCard>

      <TransactionFieldCard
        icon={Camera}
        title="After meter photo"
        description="Confirm the photo is clear before saving."
      >
        {formData.after_photo_preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.after_photo_preview}
              alt="After meter photo preview"
              className="h-52 w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
            />
          </>
        ) : (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            No photo attached.
          </div>
        )}
      </TransactionFieldCard>

      <div className="flex items-start gap-3 rounded-2xl border border-[#d5eefc] bg-[#eef4fb] p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#62748e] ring-1 ring-[#d5eefc]">
          {formData.after_location ? (
            <ShieldCheck size={21} strokeWidth={2.2} />
          ) : (
            <MapPin size={21} strokeWidth={2.2} />
          )}
        </span>
        <p className="text-sm text-[#62748e]">
          Saving now will connect the after evidence, GPS packet, and photo hash
          to the same delivery or return transaction.
        </p>
      </div>
    </div>
  );
}
