'use client';

import Image from 'next/image';
import camera from '@/public/camera.png';

export default function OperationAfter({ formData, setFormData }) {

  
  function handleFuelLevelChange(e) {
    setFormData((prev) => ({
      ...prev,
      after_fuel_level: e.target.value,
    }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      after_photo_file: file,
      after_photo_preview: previewUrl,
    }));

    console.log('photo selected:', file);
  }

  return (
    <div>
      <div className="form-header-steps">
        <p className="steps-text pr-2">Step 4 of 5</p>
      </div>

      <h2 className="mt-4">Collect data after fuel delivery</h2>

      <p className="mt-4 h-mid-gray-s">Take a Photo</p>
      <p className="steps-text">
        Take a clear picture showing the full meter display
      </p>

      <button type="button" className="qr-code-scanning-button my-2">
        <Image
          className="w-26 brightness-100"
          alt="icon of camera"
          src={camera}
        />
        <p className="pl-6">Open camera</p>
      </button>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoChange}
        value={formData.after_photo_url}
      />

      <p className="mt-4 h-mid-gray-s">After Fuel Level</p>
      <input
        type="text"
        className="mb-4"
        value={formData.after_fuel_level}
        onChange={handleFuelLevelChange}
        placeholder="Enter fuel level"
      />
    </div>
  );
}
