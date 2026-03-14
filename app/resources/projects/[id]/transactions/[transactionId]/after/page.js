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
  const projectId = params.id;
  const transactionId = params.transactionId;
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
      console.log('params:', params);
      console.log('projectId:', projectId);
      console.log('transactionId:', transactionId);
      console.log('Submitting formData:', formData);

      if (!transactionId) {
        setErrorMessage('Transaction ID is missing.');
        return;
      }

      const { data, error } = await supabase
        .from('fuel_transactions')
        .update(
          {
            after_fuel_level: formData.after_fuel_level || null,
            after_photo_url: formData.after_photo_url || null,
          },
        )
        .eq('id', transactionId)
        .select()


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

  ];
  const totalSteps = steps.length;

  return (
    
    <div className="main-container">
      <div className="form-header mt-4">
        <h1 className="ml-2">Add fuel transaction</h1>
      </div>

      {success ? (
        <AfterDeliverySuccessAlert   projectId={projectId}
        transactionId={transactionId}/>
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
