'use client';
import Image from "next/image";

export default function ReviewBefore({ formData }) {
  return (
    <div>
      <div className="form-header-steps">
        <p className="steps-text pr-2">Step 3 of 5</p>
      </div>
      <h2 className="mt-4">Review </h2>
      <p className="mt-4 h-mid-gray-s">Generator: {formData.generator_name}</p>
      <div className="divider-full"></div>
      <p className="mt-4 h-mid-gray-s">Tank: {formData.tank_name}</p>
      <div className="divider-full"></div>
      <p className="mt-4 h-mid-gray-s">
        {' '}
        Meter Reading: {formData.before_fuel_level}{' '}
      </p>
      <div className="divider-full"></div>
    

      <div className="window"></div>
      {formData.before_photo_preview && (
  <img src={formData.before_photo_preview} alt="preview" />
)}
    </div>
  );
}
