'use client';

import GeneratorDropdown from './GeneratorDropdown';
import TankDropdown from '@/components/dropdowns/tank-dropdown';
import TechniciansDropdown from '@/components/dropdowns/TechniciansDropdown';
import ManagerDropdown from '@/components/dropdowns/ManagerDropdown';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function StepThree({ formData, setFormData }) {
  const technicians = formData.technicians || [];
  const generators = formData.generators || [];

  const handleManagerSelect = (manager) => {
    setFormData((prev) => ({
      ...prev,
      manager: manager || null,
      manager_id: manager?.id || null,
    }));
  };

  const handleTechnicianSelect = (technician) => {
    setFormData((prev) => ({
      ...prev,
      selectedTechnician: technician || null,
    }));
  };

  const handleAddTechnician = () => {
    const selected = formData.selectedTechnician;

    if (!selected || !selected.id) return;

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
  };

  const handleRemoveTechnician = (technicianId) => {
    setFormData((prev) => ({
      ...prev,
      technicians: (prev.technicians || []).filter(
        (tech) => String(tech.id) !== String(technicianId)
      ),
      technician_ids: (prev.technician_ids || []).filter(
        (id) => String(id) !== String(technicianId)
      ),
    }));
  };

  const handleGeneratorSelect = (generator) => {
    setFormData((prev) => ({
      ...prev,
      selectedGenerator: generator || null,
    }));
  };

  const handleAddGenerator = () => {
    const selected = formData.selectedGenerator;

    if (!selected || !selected.id) return;

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
  };

  const handleTankSelect = (generatorId, tank) => {
    setFormData((prev) => ({
      ...prev,
      generators: (prev.generators || []).map((gen) =>
        String(gen.id) === String(generatorId)
          ? { ...gen, selectedTank: tank || null }
          : gen
      ),
    }));
  };

  const handleAddTank = (generatorId) => {
    setFormData((prev) => ({
      ...prev,
      generators: (prev.generators || []).map((gen) => {
        if (String(gen.id) !== String(generatorId)) return gen;

        const selectedTank = gen.selectedTank;
        if (!selectedTank || !selectedTank.id) return gen;

        const alreadyExists = (gen.tanks || []).some(
          (tank) => String(tank.id) === String(selectedTank.id)
        );

        if (alreadyExists) {
          return { ...gen, selectedTank: null };
        }

        return {
          ...gen,
          tanks: [...(gen.tanks || []), selectedTank],
          selectedTank: null,
        };
      }),
    }));
  };

  const handleRemoveTank = (generatorId, tankId) => {
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
  };

  const handleRemoveGenerator = (generatorId) => {
    setFormData((prev) => ({
      ...prev,
      generators: (prev.generators || []).filter(
        (gen) => String(gen.id) !== String(generatorId)
      ),
    }));
  };

  return (
    <div className="m-4">
      <h2>Setup</h2>

      <label className="mt-2 block">Choose Manager:</label>
      <ManagerDropdown
        value={formData.manager?.id || ''}
        onChange={handleManagerSelect}
      />
      <div className="divider-full mt-4 mb-4"></div>

      <label className="mt-2 block">Add Technician:</label>

      <div className=" flex items-center gap-2">
        <TechniciansDropdown
          value={formData.selectedTechnician?.id || ''}
          onChange={handleTechnicianSelect}
        />

        <button
          type="button"
          onClick={handleAddTechnician}
          className="round-icon-button"
        >
          <AddIcon />
        </button>
      </div>

      <div className="mb-4">
        {technicians.length === 0 ? (
          <p className="steps-text mb-2">No technicians assigned yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="flex w-full items-center justify-between"
              >
                <span>{tech.name}</span>

                <button
                  type="button"
                  onClick={() => handleRemoveTechnician(tech.id)}
                  className="round-icon-button "
                >
                  <RemoveIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="divider-full"></div>

      <h2 className="mt-4 mb-2">Add Fleet</h2>

      <label className=" block">Add Generator:</label>

      <div className=" flex items-center gap-2">
        <GeneratorDropdown
          value={formData.selectedGenerator?.id || ''}
          onChange={handleGeneratorSelect}
        />

        <button
          type="button"
          onClick={handleAddGenerator}
          className="round-icon-button"
        >
          <AddIcon />
        </button>
      </div>

      <div className="mb-4">
        {generators.length === 0 ? (
          <p className="steps-text mb-2">No generators assigned yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {generators.map((gen) => (
              <div key={gen.id} className="">
                <div className="mb-3 flex items-center justify-between">
                  <strong>{gen.name}</strong>

                  <button
                    type="button"
                    onClick={() => handleRemoveGenerator(gen.id)}
                    className="round-icon-button "
                  >
                    <RemoveIcon />
                  </button>
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <TankDropdown
                    value={gen.selectedTank?.id || ''}
                    onChange={(tank) => handleTankSelect(gen.id, tank)}
                  />

                  <button
                    type="button"
                    onClick={() => handleAddTank(gen.id)}
                    className="round-icon-button "
                  >
                    <AddIcon />
                  </button>
                </div>

                {(gen.tanks || []).length === 0 ? (
                  <p className="steps-text">No tanks assigned yet.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {(gen.tanks || []).map((tank) => (
                      <li
                        key={`${gen.id}-${tank.id}`}
                        className="flex items-center justify-between"
                      >
                        <span>{tank.name}</span>

                        <button
                          type="button"
                          onClick={() => handleRemoveTank(gen.id, tank.id)}
                          className="round-icon-button "
                        >
                          <RemoveIcon />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
