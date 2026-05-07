'use client';

import { CalendarDays, MapPin, ToggleLeft } from 'lucide-react';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-[#b7791f]">{message}</p>;
}

export default function StepOne({ formData, setFormData, errors = {} }) {
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <section className="m-4">
      <div className="mb-5 rounded-[24px] border border-[#e8edf3] bg-white/85 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff7e6] text-[#f25822] ring-1 ring-[#fee39f]">
            <MapPin size={22} strokeWidth={2.3} />
          </span>
          <div>
            <h2>Event basics</h2>
            <p className="steps-text mt-1">
              Create the project identity and confirm where the fuel operation
              will happen.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <label>
          Project name
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Event or project name"
            autoComplete="organization"
          />
          <FieldError message={errors.name} />
        </label>

        <label>
          Location
          <input
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Venue, address, city"
            autoComplete="street-address"
          />
          <FieldError message={errors.location} />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label>
            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              Start date
            </span>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="h-[46.8px]"
            />
            <FieldError message={errors.start_date} />
          </label>

          <label>
            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              End date
            </span>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="h-[46.8px]"
            />
            <FieldError message={errors.end_date} />
          </label>
        </div>

        <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                <ToggleLeft size={20} strokeWidth={2.3} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--primary-black)]">
                  Project status
                </p>
                <p className="steps-text">
                  {formData.active ? 'Active and visible' : 'Inactive project'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  active: !prev.active,
                }))
              }
              className={`!h-8 !w-16 !p-1 ${formData.active ? 'active' : 'not-active'}`}
              aria-pressed={formData.active}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white shadow-md transition ${
                  formData.active ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
