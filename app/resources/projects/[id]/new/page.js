'use client';

import { useState } from 'react';
import StepNavigation from '@/components/StepNavigation';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import IntroForm from '@/components/fuel-transaction/Intro';
import Setup from '@/components/fuel-transaction/setup';
import OperationBefore from '@/components/fuel-transaction/operation-before';
import ReviewBefore from '@/components/fuel-transaction/review-before';
import BeforeDeliverySuccessAlert from '@/components/fuel-transaction/before-delivery-success-alert';

export default function NewTransaction() {
  
  const { id: projectId } = useParams();
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'delivery',
    project_id: '',
    generator_id: '',
    generator_name: '',
    tank_id: '',
    technician_id: '',
    completed_at: '',
    before_fuel_level: '',
    before_photo_url: '',
    before_photo_file: null,
    before_photo_preview: '',
  });
  async function handleSubmit() {
    setSubmitting(true);
    setErrorMessage('');
    try {
      console.log('Submitting formData:', formData);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setErrorMessage('Could not identify technician.');
        return;
      }

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

      if (error) {
        console.error(error.message);
        setErrorMessage('Transaction could not be saved.');
        return;
      }

      setSubmitting(false);

      console.log('Inserted data:', data);
      console.log('project id' , projectId)
      setSuccess(true);

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('Unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    <IntroForm key={0} />,
    <Setup key={1} formData={formData} setFormData={setFormData} />,
    <OperationBefore key={2} formData={formData} setFormData={setFormData} />,
    <ReviewBefore key={3} formData={formData} />,
  ];

  const totalSteps = steps.length;

  return (
    <div className="main-container">
      <div className="form-header mt-4">
        <h1 className="ml-2">Add fuel transaction</h1>
      </div>

      {success ? (
        <BeforeDeliverySuccessAlert projectId={projectId} />
      ) : (
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
      )}
    </div>
  );
}
