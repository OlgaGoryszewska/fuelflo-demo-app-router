import GeneratorDropdown from './GeneratorDropdown';

export default function StepThree({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className="m-4">
      <h2>Setup</h2>
      <label>
        Add Technician:
        <input
          name="technician"
          type="text"
          value={formData.technician}
          onChange={handleChange}
        />
      </label>
      <h2 className="mt-4">Add Fleet</h2>
      <GeneratorDropdown />
      <label>
        Add Fuel Tank:
        <input
          name="tank"
          type="text"
          value={formData.tank}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
