'use client';
import React from 'react';
import ElectricRickshawOutlinedIcon from '@mui/icons-material/ElectricRickshawOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

export default function MyToggleComponent({ value, onChange }) {
  return (
    <div>
      <p className="h-mid-gray-s mt-4 mb-2">Choose transaction type</p>

      <div className="toggle-wrapper">
        <div
          className={`toggle-container ${value === 'delivery' ? 'on' : 'off'}`}
          onClick={() => {onChange('delivery'); console.log('delivery');}}
        >
          <ElectricRickshawOutlinedIcon />
          <p className="delivery">Delivery</p>
        </div>

        <div
          className={`toggle-container ${value === 'return' ? 'on' : 'off'}`}
          onClick={() => {
            onChange('return');
            console.log('return');
          }}
        >
          <UndoOutlinedIcon />
          <p className="delivery">Return</p>
        </div>
      </div>
    </div>
  );
}