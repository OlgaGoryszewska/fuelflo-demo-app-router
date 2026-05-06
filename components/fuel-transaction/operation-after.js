'use client';

import { useRef } from 'react';
import { Camera, CheckCircle2, Gauge } from 'lucide-react';
import { TransactionFieldCard, TransactionStepHeader } from './TransactionUi';

export default function OperationAfter({ formData, setFormData }) {
  function handleFuelLevelChange(e) {
    const value = e.target.value;

    if (value && !/^\d*\.?\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      after_fuel_level: value,
    }));
  }

  const inputRef = useRef(null);

  const openCamera = () => {
    inputRef.current?.click();
  };

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      after_photo_file: file,
      after_photo_preview: previewUrl,
    }));
  }

  return (
    <div className="space-y-4">
      <TransactionStepHeader
        eyebrow="After transaction"
        title="Capture final meter evidence"
        description="After the delivery or return is finished, take a clear meter photo and enter the final reading."
      />

      <TransactionFieldCard
        icon={Camera}
        title="After meter photo"
        description="Make sure the final display is visible and readable."
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
              {formData.after_photo_preview ? 'Replace photo' : 'Open camera'}
            </span>
            <span className="steps-text mt-1 block">
              Use the rear camera for the clearest final meter image.
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

        {formData.after_photo_preview && (
          <div className="mt-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
              <CheckCircle2 size={18} />
              Photo attached
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.after_photo_preview}
              alt="After meter photo preview"
              className="h-52 w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
            />
          </div>
        )}
      </TransactionFieldCard>

      <TransactionFieldCard
        icon={Gauge}
        title="After meter reading"
        description="Enter the final number exactly as shown on the meter."
      >
        <input
          type="text"
          inputMode="decimal"
          className="!h-12"
          value={formData.after_fuel_level}
          onChange={handleFuelLevelChange}
          placeholder="Enter final meter reading"
        />
      </TransactionFieldCard>
    </div>
  );
}
