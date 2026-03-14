'use client';

import { useState } from 'react';

import StepNavigation from '@/components/StepNavigation';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import ReviewAfter from '@/components/fuel-transaction/review-after';
import AfterDeliverySuccessAlert from '@/components/fuel-transaction/after-delivery-success-alert';
import OperationAfter from '@/components/fuel-transaction/operation-after';

export default function TransactionAfter() {
  const params = useParams();
  const projectId = params.projectId;
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    after_fuel_level: '',
    after_photo_url: '',
    after_photo_file: null,
    after_photo_preview: '',
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
    
            after_fuel_level: formData.after_fuel_level || null,
            after_photo_url: formData.after_photo_url || null,
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
    <OperationAfter key={0} formData={formData} setFormData={setFormData}/>,
    <ReviewAfter key={1} formData={formData} setFormData={setFormData}/>,
    <AfterDeliverySuccessAlert key={2} formData={formData} setFormData={setFormData}/>,
  ];
  const totalSteps = steps.length;

  return (
    <div className="main-container">
      <div className="form-header mt-4">
        <h1 className="ml-2">Add fuel transaction</h1>
      </div>

      {success ? (
        <AfterDeliverySuccessAlert params={projectId} />
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
