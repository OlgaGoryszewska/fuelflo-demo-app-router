
// add function and event listener also forma Data properties onChange like in step one

export default function StepTwo({formData, setFormData}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className="m-4">
      <h2>Contact to Contractor</h2>
      <label>
        Name of the Contractor:
        <input name="contractor_name" type="text"  value={formData.contractor_name}
          onChange={handleChange} required />
      </label>
      <label>
        Adress of the Contractor:
        <input name="contractor_adress" type="text" required />
      </label>
      <label>
        Email:
        <input name="email" type="email" required />
      </label>
      <label>
        Mobile Number:
        <input name="mobile" type="text" required />
      </label>
    </div>
  );
}
