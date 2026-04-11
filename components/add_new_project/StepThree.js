'use client';

import GeneratorDropdown from './GeneratorDropdown';
import TechniciansDropdown from '@/components/dropdowns/TechniciansDropdown';

export default function StepThree({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGeneratorChange = (generator) => {
    setFormData((prevData) => ({
      ...prevData,
      generator_id:
        typeof generator === 'object' ? generator?.id || '' : generator || '',
      generator_name:
        typeof generator === 'object' ? generator?.name || '' : '',
    }));
  };

  const handleTechnicianSelect = (technician) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedTechnician: technician || null,
    }));
  };

  const handleAddTechnician = () => {
    const selected = formData.selectedTechnician;

    if (!selected || !selected.id) return;

    const alreadyExists = formData.technicians.some(
      (tech) => String(tech.id) === String(selected.id)
    );

    if (alreadyExists) return;

    setFormData((prevData) => ({
      ...prevData,
      technicians: [...prevData.technicians, selected],
      technician_ids: [...prevData.technician_ids, selected.id],
      selectedTechnician: null,
    }));
  };

  const handleRemoveTechnician = (technicianId) => {
    setFormData((prevData) => ({
      ...prevData,
      technicians: prevData.technicians.filter(
        (tech) => String(tech.id) !== String(technicianId)
      ),
      technician_ids: prevData.technician_ids.filter(
        (id) => String(id) !== String(technicianId)
      ),
    }));
  };

  return (
    <div className="m-4">
      <h2>Setup</h2>

      <label className="mb-2 block">Add Technician:</label>

      <div className="mb-4 flex items-center gap-2">
        <TechniciansDropdown
          value={formData.selectedTechnician?.id || ''}
          onChange={handleTechnicianSelect}
        />

        <button
          type="button"
          onClick={handleAddTechnician}
          className="underline-link"
        >
          Add
        </button>
      </div>

      <div className="mb-6">
        {formData.technicians.length === 0 ? (
          <p>No technicians assigned yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {formData.technicians.map((tech) => (
              <div
                key={tech.id}
                className="flex w-full items-center justify-between"
              >
                <span>{tech.name}</span>

                <button
                  type="button"
                  onClick={() => handleRemoveTechnician(tech.id)}
                  className="underline-link"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="divider-full"></div>

      <h2 className="mt-4">Add Fleet</h2>

      <label className="mb-2 block">Add Generator:</label>
      <GeneratorDropdown
        value={formData.generator_id}
        onChange={handleGeneratorChange}
      />

      {formData.generator_name && (
        <p className="mt-2 text-sm text-gray-600">
          Selected generator: {formData.generator_name}
        </p>
      )}

      <label className="mt-4 block">
        Add Fuel Tank:
        <input
          name="tank"
          type="text"
          value={formData.tank || ''}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}