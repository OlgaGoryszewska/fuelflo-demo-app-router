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

  async function uploadAfterPhoto(file, transactionId) {
    if (!file) return null;

    const fileExt = file.name?.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `after-${transactionId}-${Date.now()}.${fileExt}`;
    const filePath = `fuel-transactions/${transactionId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('fuel-transaction-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message || 'Photo upload failed.');
    }

    const { data } = supabase.storage
      .from('fuel-transaction-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

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

      let afterPhotoUrl = formData.after_photo_url || null;

      if (formData.after_photo_file) {
        afterPhotoUrl = await uploadAfterPhoto(
          formData.after_photo_file,
          transactionId
        );
      }

      const { data, error } = await supabase
        .from('fuel_transactions')
        .update({
          after_fuel_level: formData.after_fuel_level || null,
          after_photo_url: afterPhotoUrl,
        })
        .eq('id', transactionId)
        .select()
        .single();

      if (error) {
        console.error(error.message);
        setErrorMessage('Transaction could not be saved.');
        return;
      }

      console.log('Updated data:', data);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    <OperationAfter key={0} formData={formData} setFormData={setFormData} />,
    <ReviewAfter key={1} formData={formData} setFormData={setFormData} />,
  ];

  const totalSteps = steps.length;

  return (
    <div className="main-container">
      <div className="form-header mt-4">
        <h1 className="ml-2">Add fuel transaction</h1>
      </div>

      {errorMessage && (
        <p className="mx-4 mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {success ? (
        <AfterDeliverySuccessAlert
          projectId={projectId}
          transactionId={transactionId}
        />
      ) : (
        <form
          className="form-transaction"
          onSubmit={(e) => e.preventDefault()}
        >
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