'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

import ProgresionBar from '@/components/ProgresionBar';
import StepNavigation from '@/components/StepNavigation';

import StepOne from '@/components/add_new_project/StepOne';
import StepTwo from '@/components/add_new_project/StepTwo';
import StepThree from '@/components/add_new_project/StepThree';
import StepFour from '@/components/add_new_project/StepFour';
import StepFive from '@/components/add_new_project/StepFive';

export default function AddProjectPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    start_date: '',
    end_date: '',
    contractor_name: '',
    contractor_address: '',
    email: '',
    mobile: '',

    selectedTechnician: null,
    technicians: [],
    technician_ids: [],

    generators: [],
    selectedGenerator: null,

    amount: '',
    selling_price: '',
    specification: '',
    additional: '',
    event_organizer_id: '',
    fuel_suppliers_id: '',
    active: true,
    company_name: '',
  });

  const buildGeneratorsTanksRows = (projectId, generators) => {
    return (generators || []).flatMap((generator) =>
      (generator.tanks || []).map((tank) => ({
        project_id: projectId,
        generator_id: generator.id,
        generator_name: generator.name,
        tank_id: tank.id,
        tank_name: tank.name,
      }))
    );
  };

  const saveGeneratorsTanks = async (projectId, formData) => {
    const rows = buildGeneratorsTanksRows(projectId, formData.generators);

    if (rows.length === 0) return;

    const { data, error } = await supabase
      .from('generators_tanks')
      .insert(rows)
      .select();

    if (error) {
      throw error;
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep !== steps.length - 1) return;

    setSubmitting(true);

    try {
      const projectPayload = {
        name: formData.name || null,
        location: formData.location || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        contractor_name: formData.contractor_name || null,
        contractor_address: formData.contractor_address || null,
        email: formData.email || null,
        mobile: formData.mobile || null,
        amount: formData.amount || null,
        selling_price: formData.selling_price || null,
        specification: formData.specification || null,
        additional: formData.additional || null,
        active: formData.active ?? true,
        company_name: formData.company_name || null,
        event_organizer_id: formData.event_organizer_id || null,
        fuel_suppliers_id: formData.fuel_suppliers_id || null,
      };

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([projectPayload])
        .select('id')
        .single();

      if (projectError) throw projectError;

      if ((formData.technician_ids || []).length > 0) {
        const technicianRelations = formData.technician_ids.map(
          (technicianId) => ({
            projects_id: projectData.id,
            profiles_id: technicianId,
          })
        );

        const { error: relationError } = await supabase
          .from('profiles_projects')
          .insert(technicianRelations);

        if (relationError) throw relationError;
      }

      await saveGeneratorsTanks(projectData.id, formData);

      alert('Project added successfully!');
      router.push(`/resources/projects/${projectData.id}`);

      setFormData({
        name: '',
        location: '',
        start_date: '',
        end_date: '',
        contractor_name: '',
        contractor_address: '',
        email: '',
        mobile: '',

        selectedTechnician: null,
        technicians: [],
        technician_ids: [],

        generators: [],
        selectedGenerator: null,

        amount: '',
        selling_price: '',
        specification: '',
        additional: '',
        event_organizer_id: '',
        fuel_suppliers_id: '',
        active: true,
        company_name: '',
      });

      setCurrentStep(0);
    } catch (err) {
      console.error('Error inserting project:', err);
      alert(err.message || 'Failed to add project');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    <StepOne key="step-1" formData={formData} setFormData={setFormData} />,
    <StepTwo key="step-2" formData={formData} setFormData={setFormData} />,
    <StepThree key="step-3" formData={formData} setFormData={setFormData} />,
    <StepFour key="step-4" formData={formData} setFormData={setFormData} />,
    <StepFive key="step-5" formData={formData} />,
  ];

  return (
    <div>
      <div className="main-container">
        <div className="form-header">
          <h1>Add new Project</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <ProgresionBar currentStep={currentStep} />
          {steps[currentStep]}

          <StepNavigation
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            totalSteps={steps.length}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
}