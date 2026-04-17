'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    start_date: '',
    end_date: '',
    contractor_name: '',
    contractor_address: '',
    email: '',
    mobile: '',
    amount: '',
    selling_price: '',
    specification: '',
    additional: '',
    company_name: '',
    expected_liters: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    async function loadProject() {
      setLoading(true);
      setError('');

      const idValue = isNaN(Number(id)) ? id : Number(id);

      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          location,
          start_date,
          end_date,
          contractor_name,
          contractor_address,
          email,
          mobile,
          amount,
          selling_price,
          specification,
          additional,
          company_name,
          expected_liters
        `)
        .eq('id', idValue)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setFormData({
        name: data.name || '',
        location: data.location || '',
        start_date: data.start_date || '',
        end_date: data.end_date || '',
        contractor_name: data.contractor_name || '',
        contractor_address: data.contractor_address || '',
        email: data.email || '',
        mobile: data.mobile || '',
        amount: data.amount ?? '',
        selling_price: data.selling_price ?? '',
        specification: data.specification || '',
        additional: data.additional || '',
        company_name: data.company_name || '',
        expected_liters: data.expected_liters ?? '',
      });

      setLoading(false);
    }

    loadProject();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const idValue = isNaN(Number(id)) ? id : Number(id);

    const { error } = await supabase
      .from('projects')
      .update({
        name: formData.name,
        location: formData.location,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        contractor_name: formData.contractor_name,
        contractor_address: formData.contractor_address,
        email: formData.email,
        mobile: formData.mobile,
        amount: formData.amount === '' ? null : Number(formData.amount),
        selling_price:
          formData.selling_price === '' ? null : Number(formData.selling_price),
        specification: formData.specification,
        additional: formData.additional,
        company_name: formData.company_name,
        expected_liters:
          formData.expected_liters === ''
            ? null
            : Number(formData.expected_liters),
      })
      .eq('id', idValue);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push(`/projects/${id}`);
    router.refresh();
  }

  if (loading) return <div className="main-container">Loading...</div>;
  if (error) return <div className="main-container">Error: {error}</div>;

  return (
    <div className="main-container">
      <div className="background-container-white">
        <h2>Edit Project</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Project name"
            className="border rounded p-2"
          />

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="border rounded p-2"
          />

          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="border rounded p-2"
          />

          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="border rounded p-2"
          />

          <input
            name="contractor_name"
            value={formData.contractor_name}
            onChange={handleChange}
            placeholder="Contractor name"
            className="border rounded p-2"
          />

          <input
            name="contractor_address"
            value={formData.contractor_address}
            onChange={handleChange}
            placeholder="Contractor address"
            className="border rounded p-2"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded p-2"
          />

          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile"
            className="border rounded p-2"
          />

          <input
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Purchase price"
            className="border rounded p-2"
          />

          <input
            type="number"
            step="0.01"
            name="selling_price"
            value={formData.selling_price}
            onChange={handleChange}
            placeholder="Selling price"
            className="border rounded p-2"
          />

          <input
            type="number"
            name="expected_liters"
            value={formData.expected_liters}
            onChange={handleChange}
            placeholder="Expected liters"
            className="border rounded p-2"
          />

          <textarea
            name="specification"
            value={formData.specification}
            onChange={handleChange}
            placeholder="Specification"
            className="border rounded p-2"
            rows={4}
          />

          <textarea
            name="additional"
            value={formData.additional}
            onChange={handleChange}
            placeholder="Additional information"
            className="border rounded p-2"
            rows={4}
          />

          <input
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Company name"
            className="border rounded p-2"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              onClick={() => router.push(`/projects/${id}`)}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}