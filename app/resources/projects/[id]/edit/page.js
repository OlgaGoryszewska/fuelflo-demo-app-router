'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

import LoadingIndicator from '@/components/LoadingIndicator';
import ProgresionBar from '@/components/ProgresionBar';
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

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(PROJECT_FORM_DEFAULTS);
  const [validationErrors, setValidationErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!id) return;

    async function loadProject() {
      setLoading(true);
      setFeedback({ type: '', message: '' });

      try {
        const projectId = isNaN(Number(id)) ? id : Number(id);

        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(
            `
            id,
            name,
            location,
            start_date,
            end_date,
            contractor_name,
            contractor_address,
            email,
            mobile,
            amount,
            selling_price,
            expected_liters,
            specification,
            additional,
            event_organizer_id,
            fuel_suppliers_id,
            manager_id,
            active,
            company_name,
            manager:profiles!projects_manager_id_fkey (
              id,
              full_name
            )
          `
          )
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;

        const { data: technicianRelations, error: technicianError } =
          await supabase
            .from('profiles_projects')
            .select(
              `
              profiles_id,
              profiles:profiles_projects_profiles_id_fkey (
                id,
                full_name
              )
            `
            )
            .eq('projects_id', projectId);

        if (technicianError) throw technicianError;

        const { data: fleetData, error: fleetError } = await supabase
          .from('generators_tanks')
          .select(
            `
            id,
            generator_id,
            generator_name,
            tank_id,
            tank_name
          `
          )
          .eq('project_id', projectId);

        if (fleetError) throw fleetError;

        const profileIds = [
          projectData.event_organizer_id,
          projectData.fuel_suppliers_id,
        ].filter(Boolean);
        let relatedProfiles = [];

        if (profileIds.length > 0) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, role, email, phone')
            .in('id', profileIds);

          if (!error) relatedProfiles = data || [];
        }

        const eventOrganizer = relatedProfiles.find(
          (profile) =>
            String(profile.id) === String(projectData.event_organizer_id)
        );
        const fuelSupplier = relatedProfiles.find(
          (profile) =>
            String(profile.id) === String(projectData.fuel_suppliers_id)
        );
        const technicians = (technicianRelations || [])
          .map((item) => ({
            id: item.profiles?.id,
            name: item.profiles?.full_name || 'Unnamed technician',
          }))
          .filter((tech) => tech.id);
        const technicianIds = technicians.map((tech) => tech.id);
        const groupedGenerators = [];

        (fleetData || []).forEach((row) => {
          const existingGenerator = groupedGenerators.find(
            (gen) => String(gen.id) === String(row.generator_id)
          );

          if (existingGenerator) {
            if (row.tank_id || row.tank_name) {
              existingGenerator.tanks.push({
                id: row.tank_id,
                name: row.tank_name,
              });
            }
          } else {
            groupedGenerators.push({
              id: row.generator_id,
              name: row.generator_name,
              selectedTank: null,
              tanks:
                row.tank_id || row.tank_name
                  ? [
                      {
                        id: row.tank_id,
                        name: row.tank_name,
                      },
                    ]
                  : [],
            });
          }
        });

        setFormData({
          ...PROJECT_FORM_DEFAULTS,
          name: projectData.name || '',
          location: projectData.location || '',
          start_date: projectData.start_date || '',
          end_date: projectData.end_date || '',
          contractor_name: projectData.contractor_name || '',
          contractor_address: projectData.contractor_address || '',
          email: projectData.email || '',
          mobile: projectData.mobile || '',
          manager_id: projectData.manager_id || null,
          manager: projectData.manager
            ? {
                id: projectData.manager.id,
                name: projectData.manager.full_name,
                full_name: projectData.manager.full_name,
              }
            : null,
          selectedTechnician: null,
          technicians,
          technician_ids: technicianIds,
          generators: groupedGenerators,
          selectedGenerator: null,
          amount: projectData.amount ?? '',
          selling_price: projectData.selling_price ?? '',
          expected_liters: projectData.expected_liters ?? '',
          specification: projectData.specification || '',
          additional: projectData.additional || '',
          event_organizer_id: projectData.event_organizer_id || '',
          event_organizer: eventOrganizer
            ? {
                id: eventOrganizer.id,
                name: eventOrganizer.full_name,
                full_name: eventOrganizer.full_name,
                role: eventOrganizer.role,
                email: eventOrganizer.email,
                phone: eventOrganizer.phone,
              }
            : null,
          fuel_suppliers_id: projectData.fuel_suppliers_id || '',
          fuel_supplier: fuelSupplier
            ? {
                id: fuelSupplier.id,
                name: fuelSupplier.full_name,
                full_name: fuelSupplier.full_name,
                role: fuelSupplier.role,
                email: fuelSupplier.email,
                phone: fuelSupplier.phone,
              }
            : null,
          active: projectData.active ?? true,
          company_name: projectData.company_name || '',
        });
      } catch (error) {
        console.error('Error loading project:', error);
        setFeedback({
          type: 'error',
          message: error.message || 'Failed to load project.',
        });
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  async function saveTechnicians(projectId, technicianIds) {
    await supabase
      .from('profiles_projects')
      .delete()
      .eq('projects_id', projectId);

    const rows = (technicianIds || []).map((technicianId) => ({
      projects_id: projectId,
      profiles_id: technicianId,
    }));

    if (rows.length === 0) return;

    const { error } = await supabase.from('profiles_projects').insert(rows);

    if (error) throw error;
  }

  async function saveGeneratorsTanks(projectId, generators) {
    await supabase
      .from('generators_tanks')
      .delete()
      .eq('project_id', projectId);

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
      const projectId = isNaN(Number(id)) ? id : Number(id);

      const { error: projectError } = await supabase
        .from('projects')
        .update(buildProjectPayload(formData))
        .eq('id', projectId);

      if (projectError) throw projectError;

      await saveTechnicians(projectId, formData.technician_ids || []);
      await saveGeneratorsTanks(projectId, formData.generators || []);

      setFeedback({
        type: 'success',
        message: 'Project updated successfully.',
      });
      router.push(`/resources/projects/${projectId}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating project:', error);
      setFeedback({
        type: 'error',
        message: error.message || 'Failed to update project.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  const currentStepMeta = PROJECT_STEPS[currentStep];
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

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Edit project</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="background-container">
          <div className="mb-4">
            <h2>{currentStepMeta.title}</h2>
            <p className="steps-text mt-1">{currentStepMeta.description}</p>
          </div>

          <ProgresionBar currentStep={currentStep} />

          {feedback.message && (
            <div
              className={`mx-4 mb-4 rounded-[22px] border p-4 text-sm ${
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
                <p>{feedback.message}</p>
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
            submitLabel="Update project"
          />
        </div>
      </form>
    </div>
  );
}
