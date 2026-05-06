'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import StepNavigation from '@/components/StepNavigation';
import { supabase } from '@/lib/supabaseClient';
import ReviewAfter from '@/components/fuel-transaction/review-after';
import AfterDeliverySuccessAlert from '@/components/fuel-transaction/after-delivery-success-alert';
import OperationAfter from '@/components/fuel-transaction/operation-after';
import { updateOfflineTransaction } from '@/lib/offline/offlineDb';
import { TransactionValidationMessage } from '@/components/fuel-transaction/TransactionUi';

export default function TransactionAfter() {
  const params = useParams();
  const projectId = params.id;
  const transactionId = params.transactionId;

  const [success, setSuccess] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    after_fuel_level: '',
    after_photo_url: '',
    after_photo_file: null,
    after_photo_preview: '',
  });

  function updateFormData(update) {
    setValidationMessage('');
    setFormData(update);
  }

  function validateStep(stepIndex) {
    let message = '';

    if (stepIndex === 0) {
      const fuelLevel = Number(formData.after_fuel_level);

      if (!formData.after_photo_file && !formData.after_photo_preview) {
        message = 'Take a clear after meter photo before continuing.';
      } else if (formData.after_fuel_level === '') {
        message = 'Enter the after meter reading before continuing.';
      } else if (!Number.isFinite(fuelLevel) || fuelLevel <= 0) {
        message = 'Enter a valid after meter reading greater than 0.';
      }
    }

    setValidationMessage(message);
    return !message;
  }

  function validateTransaction() {
    if (!validateStep(0)) {
      setCurrentStep(0);
      return false;
    }

    return true;
  }

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

  async function saveAfterOffline() {
    await updateOfflineTransaction(transactionId, {
      project_id: projectId || null,
      after_fuel_level: formData.after_fuel_level || null,
      after_photo_url: null,
      after_photo_file: formData.after_photo_file || null,
      after_photo_preview: formData.after_photo_preview || '',
      after_completed_at: new Date().toISOString(),
    });

    setSavedOffline(true);
    setSuccess(true);
  }

  async function handleSubmit() {
    if (!validateTransaction()) return;

    setSubmitting(true);
    setErrorMessage('');
    setSavedOffline(false);

    try {
      if (!transactionId) {
        setErrorMessage('Transaction ID is missing.');
        return;
      }

      if (!navigator.onLine) {
        await saveAfterOffline();
        return;
      }

      let afterPhotoUrl = formData.after_photo_url || null;

      if (formData.after_photo_file) {
        afterPhotoUrl = await uploadAfterPhoto(
          formData.after_photo_file,
          transactionId
        );
      }

      const { error } = await supabase
        .from('fuel_transactions')
        .update({
          after_fuel_level: formData.after_fuel_level || null,
          after_photo_url: afterPhotoUrl,
        })
        .eq('id', transactionId);

      if (error) {
        console.error(error);

        await saveAfterOffline();
        return;
      }

      setSavedOffline(false);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    <OperationAfter key={0} formData={formData} setFormData={updateFormData} />,
    <ReviewAfter key={1} formData={formData} setFormData={updateFormData} />,
  ];
  const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine;

  return (
    <div className="main-container">
      <div className="form-header mt-4">
        <h1 className="ml-2">Complete fuel transaction</h1>
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
          isOffline={savedOffline}
        />
      ) : (
        <form className="form-transaction" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                After step {currentStep + 1} of {steps.length}
              </p>
              <p className="steps-text">
                {isOnline ? 'Online save' : 'Offline save'}
              </p>
            </div>
            <div className="h-2 rounded-full bg-[#eef4fb]">
              <div
                className="h-2 rounded-full bg-[#62748e] transition-all"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <TransactionValidationMessage>
            {validationMessage}
          </TransactionValidationMessage>

          {steps[currentStep]}

          <StepNavigation
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            totalSteps={steps.length}
            submitting={submitting}
            onSubmit={handleSubmit}
            onValidateStep={validateStep}
          />
        </form>
      )}
    </div>
  );
}
