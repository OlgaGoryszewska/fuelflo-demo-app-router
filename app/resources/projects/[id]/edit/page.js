'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

import ProgresionBar from '@/components/ProgresionBar';
import StepNavigation from '@/components/StepNavigation';

import StepOne from '@/components/add_new_project/StepOne';
import StepTwo from '@/components/add_new_project/StepTwo';
import StepThree from '@/components/add_new_project/StepThree';
import StepFour from '@/components/add_new_project/StepFour';
import StepFive from '@/components/add_new_project/StepFive';

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const steps = [
    <StepOne key="step-1" formData={formData} setFormData={setFormData} />,
    <StepTwo key="step-2" formData={formData} setFormData={setFormData} />,
    <StepThree key="step-3" formData={formData} setFormData={setFormData} />,
    <StepFour key="step-4" formData={formData} setFormData={setFormData} />,
    <StepFive key="step-5" formData={formData} />,
  ];

  useEffect(() => {
    if (!id) return;

    async function loadProject() {
      setLoading(true);

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
            specification,
            additional,
            event_organizer_id,
            fuel_suppliers_id,
            active,
            company_name
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

        const technicians = (technicianRelations || [])
          .map((item) => ({
            id: item.profiles?.id,
            name: item.profiles?.full_name || 'Unnamed technician',
          }))
          .filter((tech) => tech.id);

        const technician_ids = technicians.map((tech) => tech.id);

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
          name: projectData.name || '',
          location: projectData.location || '',
          start_date: projectData.start_date || '',
          end_date: projectData.end_date || '',
          contractor_name: projectData.contractor_name || '',
          contractor_address: projectData.contractor_address || '',
          email: projectData.email || '',
          mobile: projectData.mobile || '',

          selectedTechnician: null,
          technicians,
          technician_ids,

          generators: groupedGenerators,
          selectedGenerator: null,

          amount: projectData.amount ?? '',
          selling_price: projectData.selling_price ?? '',
          specification: projectData.specification || '',
          additional: projectData.additional || '',
          event_organizer_id: projectData.event_organizer_id || '',
          fuel_suppliers_id: projectData.fuel_suppliers_id || '',
          active: projectData.active ?? true,
          company_name: projectData.company_name || '',
        });
      } catch (error) {
        console.error('Error loading project:', error);
        alert(error.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  const buildGeneratorsTanksRows = (projectId, generators) => {
    return (generators || []).flatMap((generator) => {
      if (!generator.tanks || generator.tanks.length === 0) {
        return [
          {
            project_id: projectId,
            generator_id: generator.id,
            generator_name: generator.name,
            tank_id: null,
            tank_name: null,
          },
        ];
      }

      return generator.tanks.map((tank) => ({
        project_id: projectId,
        generator_id: generator.id,
        generator_name: generator.name,
        tank_id: tank.id,
        tank_name: tank.name,
      }));
    });
  };

  const saveTechnicians = async (projectId, technicianIds) => {
    await supabase
      .from('profiles_projects')
      .delete()
      .eq('projects_id', projectId);

    if (!technicianIds || technicianIds.length === 0) return;

    const rows = technicianIds.map((technicianId) => ({
      projects_id: projectId,
      profiles_id: technicianId,
    }));

    const { error } = await supabase.from('profiles_projects').insert(rows);

    if (error) throw error;
  };

  const saveGeneratorsTanks = async (projectId, generators) => {
    await supabase
      .from('generators_tanks')
      .delete()
      .eq('project_id', projectId);

    const rows = buildGeneratorsTanksRows(projectId, generators);

    if (!rows.length) return;

    const { error } = await supabase.from('generators_tanks').insert(rows);

    if (error) throw error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep !== steps.length - 1) return;

    setSubmitting(true);

    try {
      const projectId = isNaN(Number(id)) ? id : Number(id);

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

      const { error: projectError } = await supabase
        .from('projects')
        .update(projectPayload)
        .eq('id', projectId);

      if (projectError) throw projectError;

      await saveTechnicians(projectId, formData.technician_ids || []);
      await saveGeneratorsTanks(projectId, formData.generators || []);

      alert('Project updated successfully!');
      router.push(`/resources/projects/${projectId}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating project:', error);
      alert(error.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="main-container">
        <div className="form-header">
          <h1>Loading project...</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="main-container">
        <div className="form-header">
          <h1>Edit Project</h1>
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
