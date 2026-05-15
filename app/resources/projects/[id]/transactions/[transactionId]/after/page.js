'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import StepNavigation from '@/components/StepNavigation';
import { supabase } from '@/lib/supabaseClient';
import ReviewAfter from '@/components/fuel-transaction/review-after';
import AfterDeliverySuccessAlert from '@/components/fuel-transaction/after-delivery-success-alert';
import OperationAfter from '@/components/fuel-transaction/operation-after';
import {
  getOfflineTransaction,
  markOfflineTransactionSynced,
  updateOfflineTransaction,
} from '@/lib/offline/offlineDb';
import { TransactionValidationMessage } from '@/components/fuel-transaction/TransactionUi';
import { getCurrentProfileRole } from '@/lib/auth/currentProfileRole';

const TRANSACTION_EDIT_ROLES = new Set(['manager', 'hire_desk']);

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
  const [localTransaction, setLocalTransaction] = useState(null);
  const [loadingLocalTransaction, setLoadingLocalTransaction] = useState(true);
  const [role, setRole] = useState('');

  const [formData, setFormData] = useState({
    after_fuel_level: '',
    after_photo_url: '',
    after_photo_file: null,
    after_photo_preview: '',
    after_location: null,
    after_location_error: '',
    after_captured_at: '',
    after_photo_sha256: '',
    after_capture_context: null,
    after_note: '',
  });

  function updateFormData(update) {
    setValidationMessage('');
    setFormData(update);
  }

  useEffect(() => {
    let active = true;

    async function loadLocalTransaction() {
      const [currentRole, transaction] = await Promise.all([
        getCurrentProfileRole(),
        getOfflineTransaction(transactionId),
      ]);

      if (!active) return;

      setRole(currentRole);
      setLocalTransaction(transaction || null);
      setLoadingLocalTransaction(false);

      if (
        transaction?.status === 'completed' &&
        (transaction.after_photo_file || transaction.after_photo_url) &&
        transaction.after_fuel_level
      ) {
        setSavedOffline(transaction.sync_status !== 'synced');
        setSuccess(true);
      }
    }

    loadLocalTransaction();

    return () => {
      active = false;
    };
  }, [transactionId]);

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

  async function saveAfterOffline(uploadedPhotoUrl = null) {
    const completedAt = new Date().toISOString();
    const existing = await getOfflineTransaction(transactionId);

    if (!existing) {
      throw new Error(
        'This transaction is not saved on this device. Open it online once, then try offline again.'
      );
    }

    await updateOfflineTransaction(transactionId, {
      project_id: projectId || null,
      after_fuel_level: formData.after_fuel_level || null,
      after_photo_url: uploadedPhotoUrl,
      after_photo_file: uploadedPhotoUrl ? null : formData.after_photo_file || null,
      after_photo_preview: formData.after_photo_preview || '',
      after_location: formData.after_location || null,
      after_location_error: formData.after_location_error || '',
      after_captured_at: formData.after_captured_at || completedAt,
      after_photo_sha256: formData.after_photo_sha256 || '',
      after_capture_context: formData.after_capture_context || null,
      after_note: formData.after_note?.trim() || null,
      after_upload_status: uploadedPhotoUrl ? 'uploaded' : 'pending',
      completed_at: completedAt,
      after_completed_at: completedAt,
      status: 'completed',
      sync_status: 'pending',
    });

    setLocalTransaction({
      ...existing,
      after_fuel_level: formData.after_fuel_level || null,
      after_photo_url: uploadedPhotoUrl,
      after_photo_file: uploadedPhotoUrl ? null : formData.after_photo_file || null,
      after_photo_preview: formData.after_photo_preview || '',
      after_location: formData.after_location || null,
      after_location_error: formData.after_location_error || '',
      after_captured_at: formData.after_captured_at || completedAt,
      after_photo_sha256: formData.after_photo_sha256 || '',
      after_capture_context: formData.after_capture_context || null,
      after_note: formData.after_note?.trim() || null,
      after_upload_status: uploadedPhotoUrl ? 'uploaded' : 'pending',
      completed_at: completedAt,
      after_completed_at: completedAt,
      status: 'completed',
      sync_status: 'pending',
    });
    setSavedOffline(true);
    setSuccess(true);
  }

  async function handleSubmit() {
    if (!validateTransaction()) return;

    setSubmitting(true);
    setErrorMessage('');
    setSavedOffline(false);
    let savedLocalAfterEvidence = false;
    let uploadedAfterPhotoUrl = null;

    try {
      if (!transactionId) {
        setErrorMessage('Transaction ID is missing.');
        return;
      }

      if (!navigator.onLine) {
        await saveAfterOffline();
        savedLocalAfterEvidence = true;
        return;
      }

      uploadedAfterPhotoUrl = formData.after_photo_url || null;

      if (formData.after_photo_file) {
        uploadedAfterPhotoUrl = await uploadAfterPhoto(
          formData.after_photo_file,
          transactionId
        );
      }

      const { error } = await supabase
        .from('fuel_transactions')
        .update({
          after_fuel_level: formData.after_fuel_level || null,
          after_photo_url: uploadedAfterPhotoUrl,
          after_location: formData.after_location || null,
          after_captured_at:
            formData.after_captured_at || new Date().toISOString(),
          after_photo_sha256: formData.after_photo_sha256 || null,
          after_capture_context: formData.after_capture_context || null,
          after_note: formData.after_note?.trim() || null,
          completed_at: new Date().toISOString(),
          status: 'completed',
        })
        .eq('id', transactionId);

      if (error) {
        console.error(error);

        await saveAfterOffline(uploadedAfterPhotoUrl);
        savedLocalAfterEvidence = true;
        return;
      }

      if (localTransaction) {
        await markOfflineTransactionSynced(transactionId, {
          after_fuel_level: formData.after_fuel_level || null,
          after_photo_url: uploadedAfterPhotoUrl,
          after_photo_file: null,
          after_upload_status: uploadedAfterPhotoUrl ? 'uploaded' : 'pending',
          after_location: formData.after_location || null,
          after_captured_at:
            formData.after_captured_at || new Date().toISOString(),
          after_photo_sha256: formData.after_photo_sha256 || null,
          after_capture_context: formData.after_capture_context || null,
          after_note: formData.after_note?.trim() || null,
          completed_at: new Date().toISOString(),
          status: 'completed',
          remote_saved_at: new Date().toISOString(),
        });
      }

      setSavedOffline(false);
      setSuccess(true);
    } catch (err) {
      console.error(err);

      if (!savedLocalAfterEvidence && localTransaction) {
        try {
          await saveAfterOffline(uploadedAfterPhotoUrl);
          return;
        } catch (offlineError) {
          console.error(offlineError);
        }
      }

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
  const cannotCompleteOffline =
    !loadingLocalTransaction && !isOnline && !localTransaction;
  const canEditTransaction = TRANSACTION_EDIT_ROLES.has(role);

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

      {cannotCompleteOffline && (
        <p className="mx-4 mb-4 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          This transaction was not saved on this device. Connect to the
          internet once before collecting after evidence for it offline.
        </p>
      )}

      {!loadingLocalTransaction && !canEditTransaction && (
        <p className="mx-4 mb-4 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          Your role can view transaction evidence, but only managers and hire
          desk users can edit or complete transaction evidence.
        </p>
      )}

      {success ? (
        <AfterDeliverySuccessAlert
          projectId={projectId}
          transactionId={transactionId}
          isOffline={savedOffline}
        />
      ) : !loadingLocalTransaction && !canEditTransaction ? null : (
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
            submitting={submitting || cannotCompleteOffline}
            onSubmit={handleSubmit}
            onValidateStep={validateStep}
          />
        </form>
      )}
    </div>
  );
}
