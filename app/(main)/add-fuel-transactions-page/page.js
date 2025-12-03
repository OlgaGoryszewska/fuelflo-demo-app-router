'use client';

import ProgresionBar from '@/components/ProgresionBar';
import StepNavigation from '@/components/StepNavigation';
import MyToggleComponent from '@/components/Toggle/ToggledTransaction';
import { useState } from 'react';

import StepOneDelivery from '/components/add-fuel-delivery-components/StepOneDelivery';
import ModalFuelDelivery from '@/components/add-fuel-delivery-components/ModalFuelDelivery';

export default function AddFuelDeliveryPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    console.log('Toggled state:', !isToggled);
  };

  const steps = [
    <StepOneDelivery key="step-1" />,
    <ModalFuelDelivery key="step-2" />,
  ];
  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Add fuel transaction</h1>
      </div>
      <div className="background-container-white">
    
        <MyToggleComponent />
        <StepNavigation />
      </div>
    </div>
  );
}
