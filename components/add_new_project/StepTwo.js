'use client';

import { Mail, Phone, Truck, UsersRound } from 'lucide-react';
import ProfileRoleDropdown from '@/components/dropdowns/ProfileRoleDropdown';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-[#b7791f]">{message}</p>;
}

export default function StepTwo({ formData, setFormData, errors = {} }) {
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleOrganizerSelect(profile) {
    setFormData((prev) => ({
      ...prev,
      event_organizer: profile,
      event_organizer_id: profile?.id || '',
      contractor_name: profile?.full_name || prev.contractor_name,
      email: profile?.email || prev.email,
      mobile: profile?.phone || prev.mobile,
    }));
  }

  function handleSupplierSelect(profile) {
    setFormData((prev) => ({
      ...prev,
      fuel_supplier: profile,
      fuel_suppliers_id: profile?.id || '',
    }));
  }

  return (
    <section className="m-4">
      <div className="mb-5 rounded-[24px] border border-[#e8edf3] bg-white/85 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
            <UsersRound size={22} strokeWidth={2.3} />
          </span>
          <div>
            <h2>Partners</h2>
            <p className="steps-text mt-1">
              Assign the event organizer and the supplier responsible for fuel.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <label>
          Event organizer
          <ProfileRoleDropdown
            value={formData.event_organizer_id}
            roles={['event_organizer']}
            placeholder="Select event organizer"
            onChange={handleOrganizerSelect}
          />
          <FieldError message={errors.event_organizer_id} />
        </label>

        <label>
          Fuel supplier
          <ProfileRoleDropdown
            value={formData.fuel_suppliers_id}
            roles={['fuel_supplier']}
            placeholder="Select fuel supplier"
            onChange={handleSupplierSelect}
          />
          <FieldError message={errors.fuel_suppliers_id} />
        </label>

        <label>
          Organizer contact name
          <input
            name="contractor_name"
            type="text"
            value={formData.contractor_name}
            onChange={handleChange}
            placeholder="Main event contact"
            autoComplete="name"
          />
          <FieldError message={errors.contractor_name} />
        </label>

        <label>
          Company name
          <input
            name="company_name"
            type="text"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Organizer company"
            autoComplete="organization"
          />
          <FieldError message={errors.company_name} />
        </label>

        <label>
          Organizer address
          <input
            name="contractor_address"
            value={formData.contractor_address}
            type="text"
            onChange={handleChange}
            placeholder="Billing or office address"
            autoComplete="street-address"
          />
          <FieldError message={errors.contractor_address} />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label>
            <span className="flex items-center gap-2">
              <Mail size={16} />
              Email
            </span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              autoComplete="email"
            />
            <FieldError message={errors.email} />
          </label>

          <label>
            <span className="flex items-center gap-2">
              <Phone size={16} />
              Mobile
            </span>
            <input
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+966..."
              autoComplete="tel"
            />
            <FieldError message={errors.mobile} />
          </label>
        </div>

        <div className="rounded-[22px] border border-[#fee39f] bg-[#fff7e6] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#f25822] ring-1 ring-[#fee39f]">
              <Truck size={19} strokeWidth={2.3} />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--primary-black)]">
                Supplier drives the fuel plan
              </p>
              <p className="steps-text mt-1">
                The selected supplier connects dispatch, pricing follow-up, and
                project margin visibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
