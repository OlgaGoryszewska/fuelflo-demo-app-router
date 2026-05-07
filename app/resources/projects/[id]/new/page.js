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
import { TransactionValidationMessage } from '@/components/fuel-transaction/TransactionUi';
import { saveTransactionOffline } from '@/lib/offline/offlineDb';

export default function NewTransaction() {
  const { id: projectId } = useParams();

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [savedOffline, setSavedOffline] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

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
    status: 'awaiting_after_evidence',
  });

  function updateFormData(update) {
    setValidationMessage('');
    setFormData(update);
  }

  function validateStep(stepIndex) {
    let message = '';

    if (stepIndex === 1) {
      if (!formData.type) {
        message = 'Choose delivery or return before continuing.';
      } else if (!formData.generator_id) {
        message = 'Select or scan a generator before continuing.';
      } else if (!formData.tank_id) {
        message = 'Select an external tank before continuing.';
      }
    }

    if (stepIndex === 2) {
      const fuelLevel = Number(formData.before_fuel_level);

      if (!formData.before_photo_file && !formData.before_photo_preview) {
        message = 'Take a clear meter photo before continuing.';
      } else if (formData.before_fuel_level === '') {
        message = 'Enter the meter reading before continuing.';
      } else if (!Number.isFinite(fuelLevel) || fuelLevel <= 0) {
        message = 'Enter a valid meter reading greater than 0.';
      }
    }

    setValidationMessage(message);
    return !message;
  }

  function validateTransaction() {
    const requiredSteps = [1, 2];

    for (const stepIndex of requiredSteps) {
      if (!validateStep(stepIndex)) {
        setCurrentStep(stepIndex);
        return false;
      }
    }

    return true;
  }

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

  async function getCurrentTechnician() {
    if (navigator.onLine) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        throw new Error('Could not identify technician.');
      }

      localStorage.setItem('offline_user_id', user.id);
      return user;
    }

    const savedUserId = localStorage.getItem('offline_user_id');

    if (!savedUserId) {
      throw new Error(
        'You are offline and no technician was saved. Please login once with internet.'
      );
    }

    return { id: savedUserId };
  }

  function createOfflineTransaction(newTransactionId, user) {
    return {
      id: newTransactionId,
      type: formData.type || null,
      project_id: projectId || null,

      generator_id: formData.generator_id || null,
      generator_name: formData.generator_name || '',

      tank_id: formData.tank_id || null,
      tank_name: formData.tank_name || '',

      technician_id: user.id,
      completed_at: null,

      before_fuel_level: formData.before_fuel_level || null,

      before_photo_url: null,
      before_photo_file: formData.before_photo_file || null,
      before_photo_preview: formData.before_photo_preview || '',

      status: 'awaiting_after_evidence',
      sync_status: 'pending',
    };
  }

  async function handleSubmit() {
    if (!validateTransaction()) return;

    setSavedOffline(false);
    setSuccess(false);
    setSubmitting(true);
    setErrorMessage('');

    const newTransactionId = crypto.randomUUID();
    try {
      const user = await getCurrentTechnician();

      const offlineTransaction = createOfflineTransaction(
        newTransactionId,
        user
      );

      if (!navigator.onLine) {
        await saveTransactionOffline(offlineTransaction);

        setSavedOffline(true);
        setTransactionId(newTransactionId);
        setSuccess(true);
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
            completed_at: null,
            before_fuel_level: formData.before_fuel_level || null,
            before_photo_url: beforePhotoUrl,
            status: 'awaiting_after_evidence',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error(error);

        await saveTransactionOffline(offlineTransaction);

        setSavedOffline(true);
        setTransactionId(newTransactionId);
        setSuccess(true);
        return;
      }

      setSavedOffline(false);
      setTransactionId(data.id);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Unexpected error occurred.');
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    <IntroForm key={0} />,
    <Setup key={1} formData={formData} setFormData={updateFormData} />,
    <OperationBefore
      key={2}
      formData={formData}
      setFormData={updateFormData}
    />,
    <ReviewBefore key={3} formData={formData} />,
  ];
  const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine;

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
          isOffline={savedOffline}
        />
      ) : (
        <form className="form-transaction" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                Step {currentStep + 1} of {steps.length}
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
