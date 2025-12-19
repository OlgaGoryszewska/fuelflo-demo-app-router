

'use client';
import React, { useState} from 'react';

import FuelReturnForm from '@/components/fuel-transactions/fuel-return-form.js';
import FuelDeliveryForm from '@/components/fuel-transactions/fuel-delivery-form.js';

export default function MyToggleComponent() {
  const [selectedOption, setSelectedOption] = useState('delivery');
  const handleToggle = (option) => {
    setSelectedOption(option);
  };


  return (
    <div>
      <div className=" toggle-wrapper justify-evenly">
        <div
          className={`toggle-container ${selectedOption === 'delivery' ? 'on' : 'off'}`}
          onClick={() => handleToggle('delivery')}
        >
          <span className="material-symbols-outlined black mr-2">
            delivery_truck_speed
          </span>
          <p className="delivery">Delivery</p>
        </div>
        <div
          className={`toggle-container ${selectedOption === 'return' ? 'on' : 'off'}`}
          onClick={() => handleToggle('return')}
        >
          <span className="material-symbols-outlined black">replay</span>

          <p className="delivery ">Return </p>
        </div>
      </div>
      <div className="mt-6">
        {selectedOption === 'delivery' && <FuelDeliveryForm />}
        {selectedOption === 'return' && <FuelReturnForm />}
      </div>
     
    
      <button className="button-big-border-orange mb-4 ">
        <span className="material-symbols-outlined black pr-2">qr_code</span>
        Skan Generator QR Code
      </button>

      <div className="flex flex-col items-center">
        <h3 className="delivery ">or</h3>

        <input
          className="input-gray"
          type="text"
          placeholder="Search by name..."
        />
      </div>
    </div>
  );
}
