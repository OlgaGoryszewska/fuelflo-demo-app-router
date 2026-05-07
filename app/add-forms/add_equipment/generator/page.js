'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import generator from '@/public/generator.png';
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Fuel,
  Gauge,
  Hash,
  Zap,
} from 'lucide-react';
import {
  TransactionFieldCard,
  TransactionStepHeader,
} from '@/components/fuel-transaction/TransactionUi';

const DEFAULT_FORM = {
  name: '',
  model_no: '',
  fleet_no: '',
  fuel_capacity: '',
  fuel_consumption_100: '',
  run_hours_100_load: '',
  notes: '',
};

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-[#b7791f]">{message}</p>;
}

function StatusMessage({ message }) {
  if (!message.text) return null;

  const isSuccess = message.type === 'success';

  return (
    <p
      className={`mb-4 flex items-start gap-2 rounded-xl border p-3 text-sm font-medium ${
        isSuccess
          ? 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
      role={isSuccess ? 'status' : 'alert'}
    >
      {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      {message.text}
    </p>
  );
}

export default function AddGenerator() {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Generator name is required.';
    if (!formData.model_no.trim()) nextErrors.model_no = 'Model number is required.';
    if (!formData.fleet_no.trim()) nextErrors.fleet_no = 'Fleet number is required.';

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage({
        type: 'error',
        text: 'Please fix the highlighted fields before saving.',
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('generators').insert([formData]);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Generator added successfully.' });
      setFormData(DEFAULT_FORM);
      setErrors({});
    }

    setSubmitting(false);
  }

  return (
    <div className="main-container">
      <div className="form-header mt-4">
        <h1 className="ml-2">Add equipment</h1>
      </div>

      <form className="form-transaction" onSubmit={handleSubmit}>
        <TransactionStepHeader
          eyebrow="Generator"
          title="Add generator"
          description="Create the generator record used by projects and fuel transactions."
        />

        <Image
          src={generator}
          alt="Generator"
          className="mx-auto mb-4 h-28 w-28 object-contain"
        />

        <StatusMessage message={message} />

        <div className="space-y-4">
          <TransactionFieldCard
            icon={Zap}
            title="Generator identity"
            description="Name and identify this generator in the fleet."
          >
            <div className="grid grid-cols-1 gap-4">
              <label>
                Name
                <input
                  name="name"
                  type="text"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Generator name"
                />
                <FieldError message={errors.name} />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label>
                  <span className="flex items-center gap-2">
                    <Hash size={16} />
                    Model number
                  </span>
                  <input
                    name="model_no"
                    type="text"
                    onChange={handleChange}
                    value={formData.model_no}
                    placeholder="Model number"
                  />
                  <FieldError message={errors.model_no} />
                </label>

                <label>
                  <span className="flex items-center gap-2">
                    <Hash size={16} />
                    Fleet number
                  </span>
                  <input
                    name="fleet_no"
                    type="text"
                    onChange={handleChange}
                    value={formData.fleet_no}
                    placeholder="Fleet number"
                  />
                  <FieldError message={errors.fleet_no} />
                </label>
              </div>
            </div>
          </TransactionFieldCard>

          <TransactionFieldCard
            icon={Fuel}
            title="Fuel performance"
            description="Record capacity, consumption, and expected runtime."
          >
            <div className="grid grid-cols-1 gap-4">
              <label>
                Fuel capacity
                <input
                  name="fuel_capacity"
                  type="text"
                  inputMode="decimal"
                  onChange={handleChange}
                  value={formData.fuel_capacity}
                  placeholder="Capacity in litres"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label>
                  <span className="flex items-center gap-2">
                    <Gauge size={16} />
                    Consumption at 100% load
                  </span>
                  <input
                    name="fuel_consumption_100"
                    type="text"
                    inputMode="decimal"
                    onChange={handleChange}
                    value={formData.fuel_consumption_100}
                    placeholder="Litres per hour"
                  />
                </label>

                <label>
                  <span className="flex items-center gap-2">
                    <Gauge size={16} />
                    Runtime at 100% load
                  </span>
                  <input
                    name="run_hours_100_load"
                    type="text"
                    inputMode="decimal"
                    onChange={handleChange}
                    value={formData.run_hours_100_load}
                    placeholder="Run hours"
                  />
                </label>
              </div>
            </div>
          </TransactionFieldCard>

          <TransactionFieldCard
            icon={FileText}
            title="Notes"
            description="Add service notes, site restrictions, or operating details."
          >
            <label>
              Notes
              <textarea
                name="notes"
                onChange={handleChange}
                value={formData.notes}
                placeholder="Optional notes"
                className="min-h-28 w-full rounded-[10px] border border-[var(--primary-gray-light)] bg-white p-3 text-base text-[var(--slate-dark)]"
              />
            </label>
          </TransactionFieldCard>
        </div>

        <button type="submit" disabled={submitting} className="button-big mt-5">
          {submitting ? 'Saving...' : 'Save generator'}
        </button>
      </form>
    </div>
  );
}
