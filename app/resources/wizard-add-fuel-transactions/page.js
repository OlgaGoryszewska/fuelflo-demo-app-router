

//setup, inf/ photo before/ review photo/ meter reading/ review= submit/ congrats
//phot after/ meter reading// review, submit / congrats send / view 


'use client';

import { useState } from 'react';
//steps
import IntroForm from '@/components/fuel-transaction/Intro-form'; 
import Setup from '@/components/fuel-transaction/setup-form'
import StepNavigation from '@/components/StepNavigation';



export default function Wizzard() {
  const [currentStep, setCurrentStep]= useState (0)

  const steps = [
    <Setup key="step-1"/>,
    <IntroForm key="step-2"/>
  ]
  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Add fuel transaction </h1>
      </div>
      <form className='p-2' >
      {steps[currentStep]}
        
        <StepNavigation
        currentStep ={currentStep}
        setCurrentStep={setCurrentStep}/>

      </form>
    </div>
  );
}
