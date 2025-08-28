
export default function StepOneDelivery({ formData, setFormData }) {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    return (
      <div className="m-4">
        <img src="/fuel.png" alt="main page image" className="pb-4 m-auto filter opacity-80  " />
        <h2 > Delivery Specification
        </h2>
         <label>
         You are currently on the project:
          <input
            name="name"
            type="text"
            onChange={handleChange}
          />
        </label>
        <label>
         Find Generator:
          <input
            name="name"
            type="text"
            onChange={handleChange}
          />
        </label>
        <label>
         Find Tank:
          <input
            name="name"
            type="text"
            onChange={handleChange}
          />
        </label>
        <label>
         Add Date of Delivery:
          <input
            name="name"
            type="text"
            onChange={handleChange}
          />
        </label>
        
         </div>
    );
  }
