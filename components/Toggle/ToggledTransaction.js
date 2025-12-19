// while pressing delivery or return the toggle should change its state and reflect which one is selected.
// on is for delivery and off is for return.

'use client';
import React, { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabaseClient';
import StepNavigation from '../StepNavigation';
import Image from 'next/image';
import delivery from '@/public/delivery.png';


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
      <p className="mb-4 font-medium text-center "
      onClick={() => handleToggle(selectedOption === 'return' ? 'delivery' : 'return')}>
        You currently perform fuel  {selectedOption}
      </p>
      <Image
         src={delivery} // Use the imported image
         alt="Description of my image"
         className='mb-4'
      />

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
