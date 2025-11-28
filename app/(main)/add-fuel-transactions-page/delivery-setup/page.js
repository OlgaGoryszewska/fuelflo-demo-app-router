'use client';

import ProgresionBar from '@/components/ProgresionBar';
import StepNavigation from '@/components/StepNavigation';
import { useState } from 'react';

import StepOneDelivery from '/components/add-fuel-delivery-components/StepOneDelivery';
import ModalFuelDelivery from '@/components/add-fuel-delivery-components/ModalFuelDelivery';

export default function FuelDeliverySetupPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    <StepOneDelivery key="step-1" />,
    <ModalFuelDelivery key="step-2" />,
  ];
  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Add fuel transaction</h1>
      </div>
      <form>
        <ProgresionBar currentStep={currentStep} />
        {steps[currentStep]}

        <StepNavigation
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          totalSteps={steps.length}
        />
      </form>
    </div>
  );
}
