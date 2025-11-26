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
    start_date: '',
    end_date: '',
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
      // 1️⃣ take "generator" out of formData
      const { generator, ...rest } = formData;

      // 2️⃣ build the object that matches your "projects" table
      const payload = {
        ...rest,
        generator_id: generator || null, // 👈 FK column in DB
      };

      console.log('Payload to insert:', payload); // TEMP: see what we send

      const { error } = await supabase.from('projects').insert([payload]);

      if (error) throw error;
      router.push('/projects');
      setSubmitting(false);

      alert('Project added successfully!');
      // optionally reset form
      setFormData({
        name: '',
        location: '',
        start_date: '',
        end_date: '',
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
        <div className="form-header mb-4">
          <h1 className="">Add new Project</h1>
        </div>
        <form onSubmit={handleSubmit}>
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
