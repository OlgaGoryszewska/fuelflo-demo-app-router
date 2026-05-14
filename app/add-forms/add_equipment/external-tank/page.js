'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import tank from '@/public/tank.png';
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Fuel,
  Hash,
  Layers,
} from 'lucide-react';
import {
  TransactionFieldCard,
  TransactionStepHeader,
} from '@/components/fuel-transaction/TransactionUi';

const DEFAULT_FORM = {
  name: '',
  tank_nr: '',
  capacity_liters: '',
  tank_type: '',
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

export default function AddTank() {
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

    if (!formData.name.trim()) nextErrors.name = 'Tank name is required.';
    if (!formData.tank_nr.trim()) nextErrors.tank_nr = 'Tank number is required.';
    if (!formData.capacity_liters.trim()) {
      nextErrors.capacity_liters = 'Capacity is required.';
    }

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

    const { error } = await supabase.from('tanks').insert([formData]);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'External tank added successfully.' });
      setFormData(DEFAULT_FORM);
      setErrors({});
    }

    setSubmitting(false);
  }

  return (
    <main className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Equipment</p>
      </div>

      <section className="mb-4 overflow-hidden rounded-[28px] border border-[#d9e2ec] bg-gradient-to-br from-white via-[#f8fbff] to-[#d5eefc] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">
              External tank
            </p>
            <h2 className="mt-2">Add external tank</h2>
            <p className="steps-text mt-1">
              Create the fuel source record used by projects and transactions.
            </p>
          </div>
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-white/80 ring-1 ring-white">
            <Image
              src={tank}
              alt="External tank"
              className="h-12 w-12 object-contain"
            />
          </span>
        </div>
      </section>

      <form
        className="background-container-white mb-4"
        onSubmit={handleSubmit}
      >
        <TransactionStepHeader
          eyebrow="Create record"
          title="Tank details"
          description="Add identity and capacity data used for deliveries and returns."
        />

        <StatusMessage message={message} />

        <div className="space-y-4">
          <TransactionFieldCard
            icon={Fuel}
            title="Tank identity"
            description="Name and identify this tank in the system."
          >
            <div className="grid grid-cols-1 gap-4">
              <label>
                Name
                <input
                  name="name"
                  type="text"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Tank name"
                />
                <FieldError message={errors.name} />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label>
                  <span className="flex items-center gap-2">
                    <Hash size={16} />
                    Tank number
                  </span>
                  <input
                    name="tank_nr"
                    type="text"
                    onChange={handleChange}
                    value={formData.tank_nr}
                    placeholder="Tank number"
                  />
                  <FieldError message={errors.tank_nr} />
                </label>

                <label>
                  <span className="flex items-center gap-2">
                    <Layers size={16} />
                    Tank type
                  </span>
                  <input
                    name="tank_type"
                    type="text"
                    onChange={handleChange}
                    value={formData.tank_type}
                    placeholder="Tank type"
                  />
                </label>
              </div>
            </div>
          </TransactionFieldCard>

          <TransactionFieldCard
            icon={Fuel}
            title="Capacity"
            description="Record the usable fuel volume for planning and returns."
          >
            <label>
              Capacity litres
              <input
                name="capacity_liters"
                type="text"
                inputMode="decimal"
                onChange={handleChange}
                value={formData.capacity_liters}
                placeholder="Capacity in litres"
              />
              <FieldError message={errors.capacity_liters} />
            </label>
          </TransactionFieldCard>

          <TransactionFieldCard
            icon={FileText}
            title="Notes"
            description="Add location notes, access instructions, or service details."
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
          {submitting ? 'Saving...' : 'Save external tank'}
        </button>
      </form>
    </main>
  );
}
