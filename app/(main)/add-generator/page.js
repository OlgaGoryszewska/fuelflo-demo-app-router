'use client';

export default function AddGenerator({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className="m-2.5">
      <form className="space-y-4">
        <div className="m-4">
          <img
            src="/generator.png"
            alt="generator image"
            className="w-1/2 mx-auto"
          />
          <h2>Add Generator</h2>
          <label>
            Name:
            <input name="name" type="text" onChange={handleChange} />
          </label>
          <label>
            Model No:
            <input name="name" type="text" onChange={handleChange} />
          </label>
          <label>
            Fuel Capacity:
            <input name="name" type="text" onChange={handleChange} />
          </label>
          <label>
            Fuel consumption 100% load:
            <input name="name" type="text" onChange={handleChange} />
          </label>
          <label>
            Run hours at 100% load:
            <input name="name" type="text" onChange={handleChange} />
          </label>
        </div>
      </form>
    </div>
  );
}
