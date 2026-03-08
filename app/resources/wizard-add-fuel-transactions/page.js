//setup, inf/ photo before/ review photo/ meter reading/ review= submit/ congrats
//phot after/ meter reading// review, submit / congrats send / view

'use client';

import { useState } from 'react';
import StepNavigation from '@/components/StepNavigation';
//steps
import IntroForm from '@/components/fuel-transaction/Intro';
import Setup from '@/components/fuel-transaction/setup';
import ImageBefore from '@/components/fuel-transaction/image-before'

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
  <IntroForm key={0}/>,
  <Setup key={1} />,
  <ImageBefore key={2}/>];
  
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
