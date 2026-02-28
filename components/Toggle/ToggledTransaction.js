'use client';
import React, { useState } from 'react';

import StepOneFuelReturnForm from '@/app/(main)/resources/ongoing-projects-page/[id]/add-fuel-transactions-page/fuel-return-form/step-one-fuel-return-form.js'
import StepOneFuelDeliveryForm from '@/app/(main)/resources/ongoing-projects-page/[id]/add-fuel-transactions-page/fuel-delivery-form/step-one-fuel-delivery-form.js';

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
        {selectedOption === 'delivery' && <StepOneFuelDeliveryForm />}
        {selectedOption === 'return' && < StepOneFuelReturnForm />}
      </div>
    </div>
  );
}
