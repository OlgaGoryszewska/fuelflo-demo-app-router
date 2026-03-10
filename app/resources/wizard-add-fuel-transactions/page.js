//setup, inf/ photo before/ review photo/ meter reading/ review= submit/ congrats
//phot after/ meter reading// review, submit / congrats send / view

'use client';

import { useState } from 'react';
import StepNavigation from '@/components/StepNavigation';
//steps
import IntroForm from '@/components/fuel-transaction/Intro';
import Setup from '@/components/fuel-transaction/setup';
import OperationBefore from '@/components/fuel-transaction/operation-before'
import OperationAfter from '@/components/fuel-transaction/operation-after';
import ReviewBefore from '@/components/fuel-transaction/review-before';
import BeforeDeliverySuccessAlert from '@/components/fuel-transaction/before-delivery-success-alert'
import ReviewAfter from '@/components/fuel-transaction/review-after'
import AfterDeliverySuccessAlert from '@/components/fuel-transaction/after-delivery-success-alert'


export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
  <IntroForm key={0}/>,
  <Setup key={1} />,
  <OperationBefore key={2}/>,
  <ReviewBefore key={3}/>,
  <BeforeDeliverySuccessAlert key={4}/>,
  <OperationAfter key={5}/>,
  <ReviewAfter key={6}/>,
  <AfterDeliverySuccessAlert key={7}/>
  
  ];

  const totalSteps= steps.length;


  
  return (
    <div className="main-container">
      <div className="form-header mt-4">
        <h1 className="ml-2">Add fuel transaction </h1>
      </div>
      <form className="form-transaction">
        {steps[currentStep]}

        <StepNavigation
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          totalSteps={totalSteps}
        />
      </form>
    </div>
  );
}
