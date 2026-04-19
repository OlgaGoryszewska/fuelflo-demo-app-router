'use client';
import CurrencyInput from 'react-currency-input-field';

export default function StepFour({ formData, setFormData }) {
  const handleChange = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className="m-4">
           <h2 className='mt-4'>Status</h2>
      <div className="flex justify-between align-middle mt-2">
     
      <label className='mt-2'>
    {formData.active ? 'Active' : 'Inactive'}
  </label>

  <button
  type="button"
  onClick={() =>
    setFormData((prev) => ({
      ...prev,
      active: !prev.active,
    }))
  }
  className={`!w-16 !h-8 !p-1 flex items-center rounded-full mb-4  ${
    formData.active ? 'active' : 'not-active'
  }`}
>
  <div
    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
      formData.active ? 'translate-x-8' : 'translate-x-0'
    }`}
  />
</button>

  
</div>
<div className='divider-full mb-4'></div>
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
          onValueChange={(value) => handleChange(value, 'amount')}
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
          value={formData.selling_price}
          onValueChange={(value) => handleChange(value, 'selling_price')}
          className="border rounded p-2 w-full"
        />
      </label>
      <h2 className="pt-4">Notes</h2>
      <label>
        Specification of the project:
        <input
          name="specification"
          type="text"
          value={formData.specification}
          onChange={(e) => handleChange(e.target.value, e.target.name)}
        />
      </label>
      <label>
        Additional Note:
        <input
          name="additional"
          type="text"
          value={formData.additional}
          onChange={(e) => handleChange(e.target.value, e.target.name)}
        />
      </label>
     
 

    </div>
  );
}
