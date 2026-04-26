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
  const [transactionId, setTransactionId] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: 'delivery',
    project_id: '',
    generator_id: '',
    generator_name: '',
    tank_id: '',
    tank_name: '',
    technician_id: '',
    completed_at: '',
    before_fuel_level: '',
    before_photo_url: '',
    before_photo_file: null,
    before_photo_preview: '',
    status:'completed',
  });

  async function uploadBeforePhoto(file, transactionId) {
    if (!file) return null;

    const fileExt = file.name?.split('.').pop() || 'jpg';
    const fileName = `before-${transactionId}-${Date.now()}.${fileExt}`;
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
      const newTransactionId = crypto.randomUUID();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage('Could not identify technician.');
        return;
      }

      let beforePhotoUrl = null;

      if (formData.before_photo_file) {
        beforePhotoUrl = await uploadBeforePhoto(
          formData.before_photo_file,
          newTransactionId
        );
      }

      const { data, error } = await supabase
        .from('fuel_transactions')
        .insert([
          {
            id: newTransactionId,
            type: formData.type || null,
            project_id: projectId || null,
            generator_id: formData.generator_id || null,
            tank_id: formData.tank_id || null,
            technician_id: user.id,
            completed_at: new Date().toISOString(),
            before_fuel_level: formData.before_fuel_level || null,
            before_photo_url: beforePhotoUrl,
            status:'complited',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error(error);
        setErrorMessage('Transaction could not be saved.');
        return;
      }

      setTransactionId(data.id);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Unexpected error occurred.');
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
        <BeforeDeliverySuccessAlert
          projectId={projectId}
          transactionId={transactionId}
        />
      ) : (
        <form className="form-transaction" onSubmit={(e) => e.preventDefault()}>
          {steps[currentStep]}

          <StepNavigation
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            totalSteps={steps.length}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </form>
      )}
    </div>
  );
}
