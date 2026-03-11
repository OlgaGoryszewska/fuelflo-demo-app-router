'use client';

export default function ReviewBefore() {
  return (
    <div>
      <div className="form-header-steps">
        <p className="steps-text pr-2">Step 3 of 5</p>
      </div>
      <h2 className="mt-4">Review </h2>
      <p className="mt-4 h-mid-gray-s">Generator:</p>
      <div className="divider-full"></div>
      <p className="mt-4 h-mid-gray-s">Tank:</p>
      <div className="divider-full"></div>
      <p className="mt-4 h-mid-gray-s">Image</p>

      <div className="window"></div>

      <p className="mt-4 h-mid-gray-s"> Meter Reading </p>
      <input className="mb-4"></input>
    </div>
  );
}
