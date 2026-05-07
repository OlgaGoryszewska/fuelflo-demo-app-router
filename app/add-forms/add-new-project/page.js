'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

import StepNavigation from '@/components/StepNavigation';

import StepOne from '@/components/add_new_project/StepOne';
import StepTwo from '@/components/add_new_project/StepTwo';
import StepThree from '@/components/add_new_project/StepThree';
import StepFour from '@/components/add_new_project/StepFour';
import StepFive from '@/components/add_new_project/StepFive';
import {
  PROJECT_FORM_DEFAULTS,
  PROJECT_STEP_FIELDS,
  PROJECT_STEPS,
  buildGeneratorsTanksRows,
  buildProjectPayload,
  firstInvalidStep,
  hasErrors,
  validateProjectForm,
  validateProjectStep,
} from '@/components/add_new_project/projectForm';

export default function AddProjectPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(PROJECT_FORM_DEFAULTS);
  const [validationErrors, setValidationErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const router = useRouter();

  async function saveGeneratorsTanks(projectId, generators) {
    const rows = buildGeneratorsTanksRows(projectId, generators);

    if (rows.length === 0) return;

    const { error } = await supabase.from('generators_tanks').insert(rows);

    if (error) throw error;
  }

  function validateStep(stepIndex) {
    const stepErrors = validateProjectStep(formData, stepIndex);

    setValidationErrors((current) => ({
      ...Object.fromEntries(
        Object.entries(current).filter(
          ([key]) => !PROJECT_STEP_FIELDS[stepIndex].includes(key)
        )
      ),
      ...stepErrors,
    }));

    if (hasErrors(stepErrors)) {
      setFeedback({
        type: 'warning',
        message: 'Please fix the highlighted fields before continuing.',
      });
      return false;
    }

    setFeedback({ type: '', message: '' });
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validateProjectForm(formData);
    setValidationErrors(errors);

    if (hasErrors(errors)) {
      const invalidStep = firstInvalidStep(formData);
      if (invalidStep !== null) setCurrentStep(invalidStep);

      setFeedback({
        type: 'warning',
        message: 'Some required project details are missing.',
      });
      return;
    }

    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([buildProjectPayload(formData)])
        .select('id')
        .single();

      if (projectError) throw projectError;

      const technicianRelations = (formData.technician_ids || []).map(
        (technicianId) => ({
          projects_id: projectData.id,
          profiles_id: technicianId,
        })
      );

      if (technicianRelations.length > 0) {
        const { error: relationError } = await supabase
          .from('profiles_projects')
          .insert(technicianRelations);

        if (relationError) throw relationError;
      }

      await saveGeneratorsTanks(projectData.id, formData.generators || []);

      setFeedback({
        type: 'success',
        message: 'Project created successfully.',
      });
      setFormData(PROJECT_FORM_DEFAULTS);
      setValidationErrors({});
      setCurrentStep(0);
      router.push(`/resources/projects/${projectData.id}`);
    } catch (err) {
      console.error('Error inserting project:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to add project.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    <StepOne
      key="step-1"
      formData={formData}
      setFormData={setFormData}
      errors={validationErrors}
    />,
    <StepTwo
      key="step-2"
      formData={formData}
      setFormData={setFormData}
      errors={validationErrors}
    />,
    <StepThree
      key="step-3"
      formData={formData}
      setFormData={setFormData}
      errors={validationErrors}
    />,
    <StepFour
      key="step-4"
      formData={formData}
      setFormData={setFormData}
      errors={validationErrors}
    />,
    <StepFive key="step-5" formData={formData} />,
  ];

  return (
    <div className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Project setup</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="background-container">
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                Step {currentStep + 1} of {steps.length}
              </p>
              <p className="steps-text">Project setup</p>
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

          {feedback.message && (
            <div
              className={`mx-4 mb-4 rounded-[22px] border p-4 ${
                feedback.type === 'success'
                  ? 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]'
                  : 'border-[#fee39f] bg-[#fff7e6] text-[#9a5f12]'
              }`}
            >
              <div className="flex items-start gap-3">
                {feedback.type === 'success' ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <AlertTriangle size={20} />
                )}
                <p className="steps-text !font-medium">{feedback.message}</p>
              </div>
            </div>
          )}

          {steps[currentStep]}

          <StepNavigation
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            totalSteps={steps.length}
            submitting={submitting}
            onSubmit={handleSubmit}
            onValidateStep={validateStep}
            submitLabel="Save project"
          />
        </div>
      </form>
    </div>
  );
}
