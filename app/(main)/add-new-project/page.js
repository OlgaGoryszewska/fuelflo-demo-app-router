'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

import ProgresionBar from '@/components/ProgresionBar';
import StepNavigation from '@/components/StepNavigation';

import StepOne from '@/components/add_new_project/StepOne';
import StepTwo from '@/components/add_new_project/StepTwo';
import StepThree from '@/components/add_new_project/StepThree';
import StepFour from '@/components/add_new_project/StepFour';
import StepFive from '@/components/add_new_project/StepFive';

export default function AddProjectPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    releaseDate: '',
    endDate: '',
    contractor_name: '',
    contractor_address: '',
    email: '',
    mobile: '',
    technician: '',
    generator: '',
    tank: '',
    amount: '',
    selling_price: '',
    specification: '',
    additional: '',
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('projects') // your table name
        .insert([formData]);

      if (error) throw error;
      router.push('/projects'); // redirect to projects page
      setSubmitting(false);

      alert('Project added successfully!');
      // optionally reset form
      setFormData({
        name: '',
        location: '',
        releaseDate: '',
        endDate: '',
        contractor_name: '',
        contractor_address: '',
        email: '',
        mobile: '',
        technician: '',
        generator: '',
        tank: '',
        amount: '',
        selling_price: '',
        specification: '',
        additional: '',
      });
      setCurrentStep(0);
    } catch (err) {
      console.error('Error inserting project:', err.message);
      alert('Failed to add project');
    }
  };

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
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <span class="material-symbols-outlined big ">add</span>
            <h1>Add new Project</h1>
          </div>
          <ProgresionBar currentStep={currentStep} />
          {steps[currentStep]}
          <StepNavigation
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            totalSteps={steps.length}
            submitting={submitting}
          />
        </form>
      </div>
    </div>
  );
}
