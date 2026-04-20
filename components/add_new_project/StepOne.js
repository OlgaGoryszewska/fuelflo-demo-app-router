
'use client'

import Image from 'next/image';
import  Blob from '@/public/blob-plus.png';

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
      <Image
        src={Blob}
        alt="project planing"
        className="w-30 mx-auto "
      />
      <h2>Specification</h2>
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
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          className="mb-4"
        />
      </label>
    </div>
  );
}
