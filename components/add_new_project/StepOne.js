export default function StepOne({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className="m-4">
      <h2>Project Specification</h2>
      <label>
        Name of the Project:
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Localisation of the Project:
        <input
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
        />
      </label>
      <label>
        Release Date:
        <input
          type="date"
          name="releaseDate"
          value={formData.releaseDate}
          onChange={handleChange}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
