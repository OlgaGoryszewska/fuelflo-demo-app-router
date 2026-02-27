'use client';

import ProgresionBar from '@/components/ProgresionBar';
import StepNavigation from '@/components/StepNavigation';
import MyToggleComponent from '@/components/Toggle/ToggledTransaction';
import { useState } from 'react';

export default function AddFuelDeliveryPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    console.log('Toggled state:', !isToggled);
  };

  const steps = [];
  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Add fuel transaction to Project: </h1>
      </div>
      <div className="background-container-white">
        <MyToggleComponent />
        <div className="flex flex-row justify-between items-center mb-4 mt-4">
          <button>Previous</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
}
