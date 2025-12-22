'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddFuleSupplier() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    company_name: '',
    address: '',
    email: '',
    mob: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { data, error } = await supabase
      .from('fuel_suppliers')
      .insert([formData]);

    if (error) {
      console.error(error);
      setMessage('❌ Error: ' + error.message);
    } else {
      setMessage('Added successfully!');
      // reset form
      setFormData({
        name: '',
        surname: '',
        company: '',
        address: '',
        email: '',
        mob: '',
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="m-2.5">
      <div className="form-header mb-4">
        <h1 className="ml-2">Add Fuel Supplier</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="m-4">

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
            Surname:
            <input
              name="surname"
              type="text"
              onChange={handleChange}
              value={formData.surname}
            />
          </label>
          <label>
            Company:
            <input
              name="company"
              type="text"
              onChange={handleChange}
              value={formData.company}
            />
          </label>
          <label>
            Address:
            <input
              name="address"
              type="text"
              onChange={handleChange}
              value={formData.address}
            />
          </label>
          <label>
            Mob:
            <input
              name="mob"
              type="text"
              onChange={handleChange}
              value={formData.mob}
            />
          </label>
          <label>
            Email:
            <input
              name="email"
              type="text"
              onChange={handleChange}
              value={formData.email}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
}
