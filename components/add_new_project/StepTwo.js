'use client';

import { Truck, UsersRound } from 'lucide-react';
import ProfileRoleDropdown from '@/components/dropdowns/ProfileRoleDropdown';
import { ProjectFieldCard, ProjectNoteCard, ProjectStepHeader } from './ProjectUi';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-[#b7791f]">{message}</p>;
}

export default function StepTwo({ formData, setFormData, errors = {} }) {
  function handleOrganizerSelect(profile) {
    setFormData((prev) => ({
      ...prev,
      event_organizer: profile,
      event_organizer_id: profile?.id || '',
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
      <ProjectStepHeader
        eyebrow="Step 2 of 5"
        title="Partners"
        description="Assign the event organizer and the supplier responsible for fuel."
        icon={UsersRound}
      />

      <div className="grid grid-cols-1 gap-4">
        <ProjectFieldCard
          icon={UsersRound}
          title="Partner records"
          description="Choose the saved organizer and supplier profiles."
        >
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
          </div>
        </ProjectFieldCard>

        <ProjectNoteCard icon={Truck} title="Supplier drives the fuel plan">
          The selected supplier connects dispatch, pricing follow-up, and
          project margin visibility.
        </ProjectNoteCard>
      </div>
    </section>
  );
}
