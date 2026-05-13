'use client';

import { Camera, CheckCircle2, Fuel, MapPin, ShieldCheck } from 'lucide-react';
import {
  TransactionFieldCard,
  TransactionReviewRow,
  TransactionStepHeader,
} from './TransactionUi';

export default function ReviewBefore({ formData }) {
  return (
    <div className="space-y-4">
      <TransactionStepHeader
        eyebrow="Step 4 of 4"
        title="Review transaction"
        description="Check the details before saving the record."
      />

      <TransactionFieldCard
        icon={CheckCircle2}
        title="Ready to save"
        description="This transaction can be saved online or stored offline if connection drops."
      >
        <div className="rounded-2xl border border-gray-100 bg-white px-3">
          <TransactionReviewRow
            label="Type"
            value={formData.type === 'return' ? 'Return' : 'Delivery'}
          />
          <TransactionReviewRow
            label="Generator"
            value={formData.generator_name}
          />
          <TransactionReviewRow label="Tank" value={formData.tank_name} />
          <TransactionReviewRow
            label="Meter reading"
            value={formData.before_fuel_level}
          />
          <TransactionReviewRow
            label="GPS evidence"
            value={
              formData.before_location
                ? `${formData.before_location.latitude.toFixed(6)}, ${formData.before_location.longitude.toFixed(6)}`
                : 'Not captured'
            }
          />
          <TransactionReviewRow
            label="GPS accuracy"
            value={
              formData.before_location?.accuracy_meters
                ? `${Math.round(formData.before_location.accuracy_meters)} m`
                : formData.before_location_error || 'Missing'
            }
          />
          <TransactionReviewRow
            label="Photo SHA-256"
            value={
              formData.before_photo_sha256
                ? `${formData.before_photo_sha256.slice(0, 12)}...`
                : 'Not calculated'
            }
          />
        </div>
      </TransactionFieldCard>

      <TransactionFieldCard
        icon={Camera}
        title="Meter photo"
        description="Confirm the photo is clear before saving."
      >
        {formData.before_photo_preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.before_photo_preview}
              alt="Before meter photo preview"
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
          {formData.before_location ? (
            <ShieldCheck size={21} strokeWidth={2.2} />
          ) : (
            <MapPin size={21} strokeWidth={2.2} />
          )}
        </span>
        <p className="text-sm text-[#62748e]">
          Location and photo hash are saved with the evidence when available.
          This strengthens the audit trail, but field GPS can still be affected
          by device permissions and signal quality.
        </p>
      </div>
    </div>
  );
}
