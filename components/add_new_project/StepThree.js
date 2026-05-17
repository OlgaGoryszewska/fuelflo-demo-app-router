'use client';

import { Plus, Trash2, UserRound, UsersRound, Zap } from 'lucide-react';
import GeneratorDropdown from './GeneratorDropdown';
import TankDropdown from '@/components/dropdowns/tank-dropdown';
import TechniciansDropdown from '@/components/dropdowns/TechniciansDropdown';
import ManagerDropdown from '@/components/dropdowns/ManagerDropdown';
import { ProjectFieldCard, ProjectStepHeader } from './ProjectUi';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-[#b7791f]">{message}</p>;
}

function IconButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="circle-btn shrink-0 text-[#62748e]"
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );
}

export default function StepThree({ formData, setFormData, errors = {} }) {
  const technicians = formData.technicians || [];
  const generators = formData.generators || [];

  function handleManagerSelect(manager) {
    setFormData((prev) => ({
      ...prev,
      manager: manager || null,
      manager_id: manager?.id || null,
    }));
  }

  function handleTechnicianSelect(technician) {
    setFormData((prev) => ({
      ...prev,
      selectedTechnician: technician || null,
    }));
  }

  function handleAddTechnician() {
    const selected = formData.selectedTechnician;

    if (!selected?.id) return;

    const alreadyExists = technicians.some(
      (tech) => String(tech.id) === String(selected.id)
    );

    if (alreadyExists) return;

    setFormData((prev) => ({
      ...prev,
      technicians: [...(prev.technicians || []), selected],
      technician_ids: [...(prev.technician_ids || []), selected.id],
      selectedTechnician: null,
    }));
  }

  function handleRemoveTechnician(technicianId) {
    setFormData((prev) => ({
      ...prev,
      technicians: (prev.technicians || []).filter(
        (tech) => String(tech.id) !== String(technicianId)
      ),
      technician_ids: (prev.technician_ids || []).filter(
        (id) => String(id) !== String(technicianId)
      ),
    }));
  }

  function handleGeneratorSelect(generator) {
    setFormData((prev) => ({
      ...prev,
      selectedGenerator: generator || null,
    }));
  }

  function handleAddGenerator() {
    const selected = formData.selectedGenerator;

    if (!selected?.id) return;

    const alreadyExists = generators.some(
      (gen) => String(gen.id) === String(selected.id)
    );

    if (alreadyExists) return;

    setFormData((prev) => ({
      ...prev,
      generators: [
        ...(prev.generators || []),
        {
          id: selected.id,
          name: selected.name,
          tanks: [],
          selectedTank: null,
        },
      ],
      selectedGenerator: null,
    }));
  }

  function handleTankSelect(generatorId, tank) {
    setFormData((prev) => ({
      ...prev,
      generators: (prev.generators || []).map((gen) =>
        String(gen.id) === String(generatorId)
          ? { ...gen, selectedTank: tank || null }
          : gen
      ),
    }));
  }

  function handleAddTank(generatorId) {
    setFormData((prev) => ({
      ...prev,
      generators: (prev.generators || []).map((gen) => {
        if (String(gen.id) !== String(generatorId)) return gen;

        const selectedTank = gen.selectedTank;
        if (!selectedTank?.id) return gen;

        const alreadyExists = (gen.tanks || []).some(
          (tank) => String(tank.id) === String(selectedTank.id)
        );

        if (alreadyExists) return { ...gen, selectedTank: null };

        return {
          ...gen,
          tanks: [...(gen.tanks || []), selectedTank],
          selectedTank: null,
        };
      }),
    }));
  }

  function handleRemoveTank(generatorId, tankId) {
    setFormData((prev) => ({
      ...prev,
      generators: (prev.generators || []).map((gen) => {
        if (String(gen.id) !== String(generatorId)) return gen;

        return {
          ...gen,
          tanks: (gen.tanks || []).filter(
            (tank) => String(tank.id) !== String(tankId)
          ),
        };
      }),
    }));
  }

  function handleRemoveGenerator(generatorId) {
    setFormData((prev) => ({
      ...prev,
      generators: (prev.generators || []).filter(
        (gen) => String(gen.id) !== String(generatorId)
      ),
    }));
  }

  return (
    <section className="m-2">
      <ProjectStepHeader
        eyebrow="Step 3 of 5"
        title="Team and fleet"
        description="Assign field ownership and connect every generator to an external tank."
        icon={UsersRound}
      />

      <div className="grid grid-cols-1 gap-5">
        <ProjectFieldCard
          icon={UserRound}
          title="Manager"
          description="Required for project responsibility."
        >
          <ManagerDropdown
            value={formData.manager_id || formData.manager?.id || ''}
            onChange={handleManagerSelect}
          />
          <FieldError message={errors.manager_id} />
        </ProjectFieldCard>

        <ProjectFieldCard
          icon={UsersRound}
          title="Technicians"
          description="At least one technician is required."
        >
          <div className="mt-3 flex items-start gap-2">
            <TechniciansDropdown
              value={formData.selectedTechnician?.id || ''}
              onChange={handleTechnicianSelect}
            />
            <IconButton label="Add technician" onClick={handleAddTechnician}>
              <Plus size={16} strokeWidth={2.4} />
            </IconButton>
          </div>
          <FieldError message={errors.technician_ids} />

          <div className="mt-3 grid grid-cols-1 gap-2">
            {technicians.length === 0 ? (
              <p className="steps-text">No technicians assigned yet.</p>
            ) : (
              technicians.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center justify-between gap-3 rounded-[18px] border border-[#e8edf3] bg-[#f5fbff] p-3"
                >
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {tech.name || tech.full_name}
                  </p>
                  <IconButton
                    label="Remove technician"
                    onClick={() => handleRemoveTechnician(tech.id)}
                  >
                    <Trash2 size={15} strokeWidth={2.3} />
                  </IconButton>
                </div>
              ))
            )}
          </div>
        </ProjectFieldCard>

        <ProjectFieldCard
          icon={Zap}
          title="Generators and tanks"
          description="Add at least one generator and one tank for each generator."
          tone="amber"
        >
          <div className="flex items-start gap-2">
            <GeneratorDropdown
              value={formData.selectedGenerator?.id || ''}
              onChange={handleGeneratorSelect}
            />
            <IconButton label="Add generator" onClick={handleAddGenerator}>
              <Plus size={16} strokeWidth={2.4} />
            </IconButton>
          </div>
          <FieldError message={errors.generators} />

          <div className="mt-3 grid grid-cols-1 gap-3">
            {generators.length === 0 ? (
              <p className="steps-text">No generators assigned yet.</p>
            ) : (
              generators.map((gen) => (
                <div
                  key={gen.id}
                  className="rounded-[22px] border border-[#d5eefc] bg-[#f5fbff] p-3"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {gen.name}
                    </p>
                    <IconButton
                      label="Remove generator"
                      onClick={() => handleRemoveGenerator(gen.id)}
                    >
                      <Trash2 size={15} strokeWidth={2.3} />
                    </IconButton>
                  </div>

                  <div className="flex items-start gap-2">
                    <TankDropdown
                      value={gen.selectedTank?.id || ''}
                      onChange={(tank) => handleTankSelect(gen.id, tank)}
                    />
                    <IconButton
                      label="Add tank"
                      onClick={() => handleAddTank(gen.id)}
                    >
                      <Plus size={16} strokeWidth={2.4} />
                    </IconButton>
                  </div>

                  {(gen.tanks || []).length === 0 ? (
                    <p className="steps-text mt-2">No tanks assigned yet.</p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(gen.tanks || []).map((tank) => (
                        <span
                          key={`${gen.id}-${tank.id}`}
                          className="inline-flex items-center gap-2 rounded-full border border-[#d5eefc] bg-white px-3 py-1 text-xs font-semibold text-[#62748e]"
                        >
                          {tank.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveTank(gen.id, tank.id)}
                            aria-label={`Remove ${tank.name}`}
                          >
                            <Trash2 size={12} strokeWidth={2.4} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ProjectFieldCard>
      </div>
    </section>
  );
}
