'use client';
import CurrencyInput from 'react-currency-input-field';

export default function StepFour() {
  return (
    <div className="m-4">
      <h2>Fuel Pricing Details</h2>
      <label>
        Purchase Price
        <CurrencyInput
          id="amount"
          name="amount"
          placeholder="Please enter a number"
          defaultValue={0}
          decimalsLimit={2}
          prefix="SAR "
          className="border rounded p-2 w-full"
        />
      </label>
      <label>
        Selling Price
        <CurrencyInput
          id="seling-price"
          name="seling-price"
          placeholder="Please enter a number"
          defaultValue={0}
          decimalsLimit={2}
          prefix="SAR "
          className="border rounded p-2 w-full"
        />
      </label>
    </div>
  );
}
