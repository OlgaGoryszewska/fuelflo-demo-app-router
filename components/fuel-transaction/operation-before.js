'use client';

import { useRef } from 'react';
import { Camera, CheckCircle2, Gauge, MapPin } from 'lucide-react';
import { TransactionFieldCard, TransactionStepHeader } from './TransactionUi';
import {
  getEvidenceCaptureContext,
  getCurrentEvidenceLocation,
  getFileSha256,
} from '@/lib/evidence/captureEvidence';

export default function OperationBefore({ formData, setFormData }) {
  const inputRef = useRef(null);

  function handleFuelLevelChange(e) {
    const value = e.target.value;

    if (value && !/^\d*\.?\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      before_fuel_level: value,
    }));
  }

  const openCamera = () => {
    inputRef.current?.click();
  };

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const capturedAt = new Date().toISOString();
    const [captureContext, { location, error: locationError }, photoHash] =
      await Promise.all([
        getEvidenceCaptureContext(),
        getCurrentEvidenceLocation(),
        getFileSha256(file),
      ]);

    setFormData((prev) => ({
      ...prev,
      before_photo_file: file,
      before_photo_preview: previewUrl,
      before_captured_at: capturedAt,
      before_location: location,
      before_location_error: locationError,
      before_photo_sha256: photoHash,
      before_capture_context: captureContext,
    }));
  }

  return (
    <div className="space-y-4">
      <TransactionStepHeader
        eyebrow="Step 3 of 4"
        title="Capture meter reading"
        description="Take a clear photo and enter the current meter value."
      />

      <TransactionFieldCard
        icon={Camera}
        title="Meter photo"
        description="Make sure the full display is visible and readable."
      >
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl border border-[#d5eefc] bg-[#eef4fb] p-4 text-left shadow-sm transition active:scale-[0.98] active:bg-[#dbeaf5]"
          onClick={openCamera}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#62748e] ring-1 ring-[#d5eefc]">
            <Camera size={21} strokeWidth={2.2} />
          </span>
          <span>
            <span className="block text-base font-semibold text-gray-900">
              {formData.before_photo_preview ? 'Replace photo' : 'Open camera'}
            </span>
            <span className="steps-text mt-1 block">
              Use the rear camera for the clearest meter image.
            </span>
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoChange}
          className="hidden"
        />

        {formData.before_photo_preview && (
          <div className="mt-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
              <CheckCircle2 size={18} />
              Photo attached
            </p>
            <div
              className={`mb-3 flex items-start gap-2 rounded-2xl border p-3 text-sm ${
                formData.before_location
                  ? 'border-green-100 bg-green-50 text-green-700'
                  : 'border-yellow-200 bg-yellow-50 text-yellow-800'
              }`}
            >
              <MapPin size={18} className="mt-0.5 shrink-0" />
              <span>
                {formData.before_location
                  ? `Location captured within ${Math.round(
                      formData.before_location.accuracy_meters || 0
                    )} m accuracy.`
                  : formData.before_location_error ||
                    'Location was not captured for this photo.'}
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.before_photo_preview}
              alt="Before meter photo preview"
              className="h-52 w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
            />
          </div>
        )}
      </TransactionFieldCard>

      <TransactionFieldCard
        icon={Gauge}
        title="Meter reading"
        description="Enter the number exactly as shown on the meter."
      >
        <input
          type="text"
          inputMode="decimal"
          value={formData.before_fuel_level}
          onChange={handleFuelLevelChange}
          placeholder="Enter meter reading"
          className="!h-12"
        />
      </TransactionFieldCard>
    </div>
  );
}
