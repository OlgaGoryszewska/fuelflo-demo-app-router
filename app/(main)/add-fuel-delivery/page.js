'use client';

import ProgresionBar from "@/components/ProgresionBar";
import StepNavigation from "@/components/StepNavigation";
import { useState } from "react";

import StepOneDelivery from "/components/add-fuel-delivery-components/StepOneDelivery";
export default function AddFuelDeliveryPage() {
    const [ currentStep, setCurrentStep ] = useState(0);

    const steps = [
    <StepOneDelivery key="step-1"  />,
    ];
  return (
    <div className="main-container">
      <form>
        <div className="form-header">
          <span className="material-symbols-outlined big ">add</span>
          <h1>Add Fuel Delivery</h1>
        </div>
        <ProgresionBar currentStep={currentStep} />
        {steps[currentStep]}

        <StepNavigation
         currentStep={currentStep}
         setCurrentStep={setCurrentStep}
         totalSteps={steps.length}/>
       
      </form>
    </div>
  );
}
