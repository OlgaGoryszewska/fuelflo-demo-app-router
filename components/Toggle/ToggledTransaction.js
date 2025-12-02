'use client';
import React, { useState,useEffect, use } from 'react';
import { supabase } from '@/lib/supabaseClient';
import StepNavigation from '../StepNavigation';

export default function MyToggleComponent() {
  const [isToggled, setIsToggled] = useState(false);
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };



  return (
    <div>
      <div className="toggle-component flex mb-4 ">
        <p
          className={`mr-4 gray-text delivery ${isToggled ? 'on' : 'off'}`}
          onClick={handleToggle}
        >
          Delivery
        </p>
        <div
          className={`toggle-container ${isToggled ? 'on' : 'off'}`}
          onClick={handleToggle}
        >
          <div className="toggle-ball"></div>
        </div>
        <p
          className={`ml-4 gray-text return ${isToggled ? 'on' : 'off'}`}
          onClick={handleToggle}
        >
          Return{' '}
        </p>
      </div>
      <div
        className={`background-container-white  ${isToggled ? 'off' : 'on'}`}
        onClick={handleToggle}
      >
         <div className="form-header mb-4">
        <span class="material-symbols-outlined">delivery_truck_speed</span>
        <h3 className="ml-2 uppercase" onClick={handleToggle}> Fuel 
        {` ${isToggled ? 'Return' : 'Delivery'}`}
        </h3>
      </div>
      <p>You are currently on the project</p>
      <p className='generator-localisation'>Project Name</p>
      <p>Find Generator</p>
      <button className='button-big'>Skan QR Code</button>
      <p>Search by Name </p>
      <input></input>
      <StepNavigation />

      </div>
      
      
    </div>
  );
}
