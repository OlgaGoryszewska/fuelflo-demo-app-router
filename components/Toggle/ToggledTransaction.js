'use client';
import React, { useState } from 'react';

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
    <div className={`generator-container  ${isToggled ? 'off' : 'on'}`}
        onClick={handleToggle}></div>
    </div>
   
  );
}
