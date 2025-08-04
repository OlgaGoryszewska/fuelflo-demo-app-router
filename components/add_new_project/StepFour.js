'use client';
import CurrencyInput from 'react-currency-input-field';

export default function StepFour({formData, setFormData}) {
  const handleChange = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
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
          value={formData.amount}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
      </label>
      <label>
        Selling Price
        <CurrencyInput
          id="seling_price"
          name="seling_price"
          placeholder="Please enter a number"
          defaultValue={0}
          decimalsLimit={2}
          prefix="SAR "
          value={formData.seling_price}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
      </label>
      <h2 className="pt-4">Notes</h2>
      <label>
        Specification of the project:
        <input name="specification" type="text" value={formData.specification}
          onChange={handleChange} required />
      </label>
      <label>
        Additional Note:
        <input name="additional" type="text" value={formData.additional}
          onChange={handleChange} required />
      </label>
    </div>
  );
}
