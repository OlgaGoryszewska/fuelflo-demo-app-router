'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddGenerator() {
  const [formData, setFormData] = useState({
    name: '',
    model_no: '',
    fleet_no: '',
    localization: '',
    fuel_capacity: '',
    fuel_consumption_100: '',
    run_hours_100_load: '',
    external_tank: '',
    notes: '',
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
      .from('generators')
      .insert([formData]);

    if (error) {
      console.error(error);
      setMessage('❌ Error: ' + error.message);
    } else {
      setMessage('✅ Generator added successfully!');
      // reset form
      setFormData({
        name: '',
        model_no: '',
        fleet_no: '',
        localization: '',
        fuel_capacity: '',
        fuel_consumption_100: '',
        run_hours_100_load: '',
        external_tank: '',
        notes: '',
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
          <img
            src="/generator.png"
            alt="generator image"
            className="w-1/2 mx-auto"
          />
          <h2>Specification</h2>
          <label>
            Model No:
            <input
              name="model_no"
              type="text"
              onChange={handleChange}
              value={formData.model_no}
            />
          </label>

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
            Fleet No:
            <input
              name="fleet_no"
              type="text"
              onChange={handleChange}
              value={formData.fleet_no}
            />
          </label>
          <label>
            Localization:
            <input
              name="localization"
              type="text"
              onChange={handleChange}
              value={formData.localization}
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
            Fuel consumption 100% load:
            <input
              name="fuel_consumption_100"
              type="text"
              onChange={handleChange}
              value={formData.fuel_consumption_100}
            />
          </label>
          <label>
            Run hours at 100% load:
            <input
              name="run_hours_100_load"
              type="text"
              onChange={handleChange}
              value={formData.run_hours_100_load}
            />
          </label>
          <label>
            Choose External Tank:
            <input
              name="external_tank"
              type="text"
              onChange={handleChange}
              value={formData.external_tank}
            />
          </label>
          <label>
            Notes:
            <input
              type="text"
              name="notes"
              onChange={handleChange}
              value={formData.notes}
              className='mb-4'
            />
          </label>
          <button 
          className='button-big '
          type="submit">Submit</button>
        {message && <p className="mt-2">{message}</p>}
        </div>
        
      </form>
    </div>
  );
}
