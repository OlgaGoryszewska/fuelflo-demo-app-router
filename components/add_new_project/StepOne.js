export default function StepOne({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className="mx-4">
      <img
        src="/blob-plus.png"
        alt="project planin"
        className="w-2/5 mx-auto "
      />
      <h2>Specification</h2>
      <label>
        Name of the Project:
        <input
        className="input-gray"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Localisation of the Project:
        <input
        className="input-gray"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
        />
      </label>
      <label>
        Release Date:
        <input
        className="input-gray"
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
        />
      </label>
      <label>
        End Date:
        <input
        className="input-gray"
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
