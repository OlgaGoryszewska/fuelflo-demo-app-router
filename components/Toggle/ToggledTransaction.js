'use client';
import React, { useState } from 'react';

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
    </div>
  );
}
