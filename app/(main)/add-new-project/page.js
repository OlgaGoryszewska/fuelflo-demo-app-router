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

export default function AddProjectPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    releaseDate: '',
    endDate: '',
  });

  const steps = [
    <StepOne key="step-1" formData={formData} setFormData={setFormData} />,
    <StepTwo key="step-2" formData={formData} setFormData={setFormData} />,
    <StepThree key="step-3" formData={formData} setFormData={setFormData} />,
    <StepFour key="step-4" formData={formData} setFormData={setFormData} />,
    <StepFive key="step-5" formData={formData} setFormData={setFormData} />,
  ];

  return (
    <div>
      <div className="main-container">
        <form>
          <div className="form-header">
            <MdAdd className="icon" />
            <h1>Add new Project</h1>
          </div>
          <ProgresionBar currentStep={currentStep} />
          {steps[currentStep]}
          <StepNavigation
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            totalSteps={steps.length}
          />
        </form>
      </div>
    </div>
  );
}
