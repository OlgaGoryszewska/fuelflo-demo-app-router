'use client';

import { useRef } from 'react';
import Image from 'next/image';
import camera from '@/public/camera.png';

export default function OperationBefore({ formData, setFormData }) {
  const inputRef = useRef(null);

  function handleFuelLevelChange(e) {
    setFormData((prev) => ({
      ...prev,
      before_fuel_level: e.target.value,
    }));
  }

  const openCamera = () => {
    inputRef.current?.click();
  };

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      before_photo_file: file,
      before_photo_preview: previewUrl,
    }));
  }

  return (
    <div>
      <div className="form-header-steps">
        <p className="steps-text pr-2">Step 2 of 5</p>
      </div>

      <h2 className="mt-4">Collect data before fuel delivery</h2>

      <p className="mt-4 h-mid-gray-s">Take a Photo</p>
      <p className="steps-text">
        Take a clear picture showing the full meter display
      </p>

      <button
        type="button"
        className="qr-code-scanning-button my-2"
        onClick={openCamera}
      >
        <Image
          className="w-26 brightness-100"
          alt="icon of camera"
          src={camera}
        />
        <p className="pl-6">Open camera</p>
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
          <img
            src={formData.before_photo_preview}
            alt="Before photo preview"
            className="window mt-2 mb-2"
          />
        </div>
      )}

      <p className="mt-4 h-mid-gray-s">Before Fuel Level</p>
      <input
        type="text"
        className="mb-4"
        value={formData.before_fuel_level}
        onChange={handleFuelLevelChange}
        placeholder="Enter fuel level"
      />
    </div>
  );
}