'use client';

export default function ReviewAfter({ formData }) {
  return (
    <div>
      <div className="form-header-steps">
        <p className="steps-text pr-2">Step 5 of 5</p>
      </div>
      <h2 className="mt-4">Review </h2>
      <p className="mt-4 h-mid-gray-s ">
        {' '}
        Meter Reading: {formData.after_fuel_level}{' '}
      </p>
      <div className="divider-full mb-4"></div>

      <div className="window mb-4 mt-2">
        {formData.after_photo_preview && (
          <img
            src={formData.after_photo_preview}
            alt="preview"
            className="window"
          />
        )}
      </div>
    </div>
  );
}
