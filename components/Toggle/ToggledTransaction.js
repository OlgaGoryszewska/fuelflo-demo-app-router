'use client';
import React, { useState } from 'react';

import ElectricRickshawOutlinedIcon from '@mui/icons-material/ElectricRickshawOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
export default function MyToggleComponent() {
  const [selectedOption, setSelectedOption] = useState('delivery');
  const handleToggle = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <div className=" toggle-wrapper ">
        <div
          className={`toggle-container ${selectedOption === 'delivery' ? 'on' : 'off'}`}
          onClick={() => handleToggle('delivery')}
        >
          <ElectricRickshawOutlinedIcon/>
          <p className="delivery">Delivery</p>
        </div>
        <div
          className={`toggle-container ${selectedOption === 'return' ? 'on' : 'off'}`}
          onClick={() => handleToggle('return')}
        >
          <UndoOutlinedIcon/>

          <p className="delivery ">Return </p>
        </div>
      </div>
   
    </div>
  );
}
