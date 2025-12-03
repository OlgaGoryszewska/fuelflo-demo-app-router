'use client';
import React, { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabaseClient';
import StepNavigation from '../StepNavigation';

export default function MyToggleComponent() {
  const [isToggled, setIsToggled] = useState(false);
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div>
      <div className=" toggle-wrapper justify-evenly">
        <div
          className={`toggle-container ${isToggled ? 'on' : 'off'}`}
          onClick={handleToggle}
        >
          <span className="material-symbols-outlined black mr-2">
            delivery_truck_speed
          </span>
          <p
            className={` delivery ${isToggled ? 'on' : 'off'}`}
            onClick={handleToggle}
          >
            Delivery
          </p>
        </div>
        <div
          className={`toggle-container ${isToggled ? 'on' : 'off'}`}
          onClick={handleToggle}
        >
          <span className="material-symbols-outlined black">replay</span>

          <p
            className={` delivery ${isToggled ? 'on' : 'off'}`}
            onClick={handleToggle}
          >
            Return{' '}
          </p>
        </div>
      </div>
      <p className="pt-4">Find Generator</p>
      <button className="button-big">
        <span className="material-symbols-outlined black pr-2">qr_code</span>
        Skan QR Code
      </button>
    
      <div className="flex flex-col items-center">
      <h3 className="m-auto body-text">or</h3>

        <input type="text" placeholder="Search by name..." />
      </div>

      
    </div>
  );
}
