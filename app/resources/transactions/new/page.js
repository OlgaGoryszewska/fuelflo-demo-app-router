//setup, inf/ photo before/ review photo/ meter reading/ review= submit/ congrats
//phot after/ meter reading// review, submit / congrats send / view

'use client';

import { useState } from 'react';
import StepNavigation from '@/components/StepNavigation';
import { supabase } from '@/lib/supabaseClient';
//steps
import IntroForm from '@/components/fuel-transaction/Intro';
import Setup from '@/components/fuel-transaction/setup';
import OperationBefore from '@/components/fuel-transaction/operation-before';
import ReviewBefore from '@/components/fuel-transaction/review-before';
import BeforeDeliverySuccessAlert from '@/components/fuel-transaction/before-delivery-success-alert';
//import ReviewAfter from '@/components/fuel-transaction/review-after'
//import AfterDeliverySuccessAlert from '@/components/fuel-transaction/after-delivery-success-alert'
//import OperationAfter from '@/components/fuel-transaction/operation-after';

export default function NewTransaction() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    created_at: '',
    type: 'delivery',
    project_id: '',
    generator_id: '',
    tank_id: '',
    technician_id: '',
    completed_at: '',
    before_fuel_level: '',
    before_photo_url: '',
  });
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    console.log('Submitting formData:', formData);

    const { data, error } = await supabase
      .from('fuel_transactions')
      .insert([
        {
          type: formData.type,
          project_id: formData.project_id || null,
          generator_id: formData.generator_id || null,
          tank_id: formData.tank_id || null,
          technician_id: formData.technician_id || null,
          completed_at: formData.completed_at || null,
          before_fuel_level: formData.before_fuel_level || null,
          before_photo_url: formData.before_photo_url || null,
          before_meter_reading: formData.before_meter_reading || null,
        },
      ])
      .select();

    setSubmitting(false);

    if (error) {
      console.error(error.message);
      return;
    }
    console.log('Inserted data:', data);
  }

  const steps = [
    <IntroForm key={0} />,
    <Setup key={1} formData={formData} setFormData={setFormData} />,
    <OperationBefore key={2} formData={formData} setFormData={setFormData} />,
    <ReviewBefore key={3} formData={formData} />,
    //<BeforeDeliverySuccessAlert key={4}/>
    //<OperationAfter key={5}/>,
    //<ReviewAfter key={6}/>,
    //<AfterDeliverySuccessAlert key={7}/>
  ];

  const totalSteps = steps.length;

  return (
    <div className="main-container">
      <div className="form-header mt-4">
        <h1 className="ml-2">Add fuel transaction </h1>
      </div>
      <form className="form-transaction" onSubmit={handleSubmit}>
        {steps[currentStep]}

        <StepNavigation
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          totalSteps={totalSteps}
          submitting={submitting}
        />
      </form>
    </div>
  );
}
