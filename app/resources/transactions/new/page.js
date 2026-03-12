//setup, inf/ photo before/ review photo/ meter reading/ review= submit/ congrats
//phot after/ meter reading// review, submit / congrats send / view

'use client';

import { useState } from 'react';
import StepNavigation from '@/components/StepNavigation';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
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
    const params = useParams();
    const projectId = params.projectId;
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({

    type: 'delivery',
    //project_id: '',
    generator_id: '',
    generator_name: '',
    tank_id: '',
    technician_id: '',
    completed_at: '',
    before_fuel_level: '',
    before_photo_url: '',
    before_photo_file: null,
  before_photo_preview: "",
  });
  async function handleSubmit() {
    setSubmitting(true);
    console.log('Submitting formData:', formData);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(user.id);

    const { data, error } = await supabase
      .from('fuel_transactions')
      .insert([
        {
          type: formData.type,
          project_id: projectId || null,
          generator_id: formData.generator_id || null,
          tank_id: formData.tank_id || null,
          technician_id: user?.id || null,
          completed_at: new Date().toISOString(),
          before_fuel_level: formData.before_fuel_level || null,
          before_photo_url: formData.before_photo_url || null,
     
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
      <form className="form-transaction">
        {steps[currentStep]}

        <StepNavigation
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          totalSteps={totalSteps}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}
