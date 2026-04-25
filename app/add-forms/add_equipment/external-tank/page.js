'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import tank from '@/public/tank.png'

export default function AddTank() {
  const [formData, setFormData] = useState({
    name: '',
    tank_nr:'',
    capacity_liters:'',
    tank_type:'',
    notes:'',

  });

  const [message, setMessage] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3️⃣ send to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('tanks')
      .insert([formData]);

    if (error) {
      console.error(error);
      setMessage('❌ Error: ' + error.message);
    } else {
      setMessage('✅ Generator added successfully!');
      // reset form
      setFormData({
        name: '',
        tank_nr:'',
        capacity_liters:'',
        tank_type:'',
        notes:'',
      });
    }
  };
  return (
    <div className="m-2.5">
      <div className="form-header mb-4">
        <h1 className="ml-2">Add Equipment</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="m-4">
          <Image
            src={tank}
            alt="generatorimage"
            className="w-30 mx-auto"
          />
          <h2>Specification</h2>
          <label>
            Name:
            <input
              name="name"
              type="text"
              onChange={handleChange}
              value={formData.name}
            />
          </label>

          <label>
            Tank nr:
            <input
              name="tank_nr"
              type="text"
              onChange={handleChange}
              value={formData.tank_nr}
            />
          </label>
          <label>
            Capacity liters:
            <input
              name="capacity_liters"
              type="text"
              onChange={handleChange}
              value={formData.capacity_liters}
            />
          </label>
          <label>
            Tank type:
            <input
              name="tank_type"
              type="text"
              onChange={handleChange}
              value={formData.tank_type}
            />
          </label>
          <label>
            Fuel Capacity:
            <input
              name="fuel_capacity"
              type="text"
              onChange={handleChange}
              value={formData.fuel_capacity}
            />
          </label>
          <label>
            Notes:
            <input
              type="text"
              name="notes"
              onChange={handleChange}
              value={formData.notes}
              className="mb-4"
            />
          </label>
          <button className="button-big " type="submit">
            Submit
          </button>
          {message && <p className="mt-2">{message}</p>}
        </div>
      </form>
    </div>
  );
}
