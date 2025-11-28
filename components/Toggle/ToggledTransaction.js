'use client';
import React, { useState } from 'react';

export default function MyToggleComponent() {
  const [isToggled, setIsToggled] = useState(false);
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };
  return (
    <div className="toggle-component flex mb-4 ">
      <p
        className={`mr-4 delivery ${isToggled ? 'on' : 'off'}`}
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
        className={`ml-4 return ${isToggled ? 'on' : 'off'}`}
        onClick={handleToggle}
      >
        Return{' '}
      </p>
    </div>
  );
}
