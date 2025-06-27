'use client';

import { MdAdd } from 'react-icons/md';
import { useState } from 'react';

import ProgresionBar from '@/components/ProgresionBar';
import StepNavigation from '@/components/StepNavigation';

import StepThree from '@/components/add_new_project/StepThree';
import StepOne from '@/components/add_new_project/StepOne';
import StepTwo from '@/components/add_new_project/StepTwo';
import StepFour from '@/components/add_new_project/StepFour';
import StepFive from '@/components/add_new_project/StepFive';


export default function Projects() {

  const [ currentStep, setCurrentStep ] = useState(0);

  const steps = [
    <StepOne key="step-1" />,
    <StepTwo key="step-2" />,
    <StepThree key="step-3" />,
    <StepFour key="step-4" />,
    <StepFive key="step-5" />,
  ];

  return (
    <form>
      <div className="form-header">
        <MdAdd className="icon" />
        <h1>Add new Project</h1>
      </div>
      <ProgresionBar currentStep={currentStep}/>
      {steps[currentStep]}
      <StepNavigation
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        totalSteps={steps.length}
      />
    </form>
  );
}
