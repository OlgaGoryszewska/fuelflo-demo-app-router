'use client';

import {
  CalendarDays,
  CircleDollarSign,
  Fuel,
  MapPin,
  Truck,
  UsersRound,
  Zap,
} from 'lucide-react';
import { getExpectedEarnings, getMargin } from './projectForm';

function ReviewCard({ icon: Icon, title, children, tone = 'slate' }) {
  const tones = {
    orange: 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]',
    green: 'bg-[#f3fbef] text-[#2f8f5b] ring-[#d7edce]',
    slate: 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]',
  };

  return (
    <section className="rounded-[24px] border border-[#e8edf3] bg-white/85 p-4">
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${tones[tone]}`}
        >
          <Icon size={20} strokeWidth={2.3} />
        </span>
        <h3 className="text-base font-semibold text-[var(--primary-black)]">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-2">{children}</div>
    </section>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="rounded-[18px] bg-[#f5fbff] p-3">
      <p className="steps-text">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--primary-black)]">
        {value || '-'}
      </p>
    </div>
  );
}

function formatMoney(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return '-';
  }

  return `${Number(value).toFixed(2)} SAR`;
}

export default function StepFive({ formData }) {
  const technicians = formData.technicians || [];
  const generators = formData.generators || [];
  const margin = getMargin(formData);
  const expectedEarnings = getExpectedEarnings(formData);

  return (
    <section className="m-4">
      <div className="mb-5 rounded-[24px] border border-[#e8edf3] bg-white/85 p-4">
        <h2>Review project</h2>
        <p className="steps-text mt-1">
          Confirm the event, people, equipment, and commercial plan before
          saving.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ReviewCard icon={MapPin} title="Event basics" tone="orange">
          <ReviewRow label="Project" value={formData.name} />
          <ReviewRow label="Location" value={formData.location} />
          <div className="grid grid-cols-2 gap-2">
            <ReviewRow label="Starts" value={formData.start_date} />
            <ReviewRow label="Ends" value={formData.end_date} />
          </div>
          <ReviewRow
            label="Status"
            value={formData.active ? 'Active' : 'Inactive'}
          />
        </ReviewCard>

        <ReviewCard icon={UsersRound} title="Partners">
          <ReviewRow
            label="Event organizer"
            value={formData.event_organizer?.name || formData.contractor_name}
          />
          <ReviewRow label="Company" value={formData.company_name} />
          <ReviewRow label="Address" value={formData.contractor_address} />
          <div className="grid grid-cols-2 gap-2">
            <ReviewRow label="Email" value={formData.email} />
            <ReviewRow label="Mobile" value={formData.mobile} />
          </div>
          <ReviewRow
            label="Fuel supplier"
            value={formData.fuel_supplier?.name || formData.fuel_suppliers_id}
          />
        </ReviewCard>

        <ReviewCard icon={Zap} title="Team and fleet">
          <ReviewRow
            label="Manager"
            value={formData.manager?.name || formData.manager_id}
          />
          <ReviewRow
            label="Technicians"
            value={
              technicians.length > 0
                ? technicians
                    .map((tech) => tech.name || tech.full_name)
                    .join(', ')
                : ''
            }
          />
          <div className="rounded-[18px] bg-[#f5fbff] p-3">
            <p className="steps-text">Generators and tanks</p>
            {generators.length === 0 ? (
              <p className="mt-1 text-sm font-semibold text-[var(--primary-black)]">
                No generators assigned
              </p>
            ) : (
              <div className="mt-2 grid grid-cols-1 gap-2">
                {generators.map((gen) => (
                  <div key={gen.id}>
                    <p className="text-sm font-semibold text-[var(--primary-black)]">
                      {gen.name}
                    </p>
                    <p className="steps-text">
                      {(gen.tanks || []).map((tank) => tank.name).join(', ') ||
                        'No tanks'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ReviewCard>

        <ReviewCard icon={Fuel} title="Fuel plan" tone="green">
          <div className="grid grid-cols-2 gap-2">
            <ReviewRow
              label="Expected litres"
              value={
                formData.expected_liters ? `${formData.expected_liters} L` : ''
              }
            />
            <ReviewRow
              label="Margin / L"
              value={
                margin === null || !Number.isFinite(Number(margin))
                  ? ''
                  : `${Number(margin).toFixed(2)} SAR`
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ReviewRow
              label="Purchase price"
              value={formData.amount ? `${formData.amount} SAR/L` : ''}
            />
            <ReviewRow
              label="Selling price"
              value={
                formData.selling_price ? `${formData.selling_price} SAR/L` : ''
              }
            />
          </div>
          <ReviewRow
            label="Expected margin"
            value={formatMoney(expectedEarnings)}
          />
        </ReviewCard>

        <ReviewCard icon={Truck} title="Notes">
          <ReviewRow label="Specification" value={formData.specification} />
          <ReviewRow label="Additional note" value={formData.additional} />
        </ReviewCard>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-[#d5eefc] bg-[#eef4fb] p-4">
            <CalendarDays className="mb-3 text-[#62748e]" size={20} />
            <p className="text-sm font-semibold text-[var(--primary-black)]">
              Ready for dispatch
            </p>
            <p className="steps-text mt-1">
              Dates, team, and fleet are checked.
            </p>
          </div>
          <div className="rounded-[22px] border border-[#d7edce] bg-[#f3fbef] p-4">
            <CircleDollarSign className="mb-3 text-[#2f8f5b]" size={20} />
            <p className="text-sm font-semibold text-[var(--primary-black)]">
              Margin planned
            </p>
            <p className="steps-text mt-1">Pricing can feed the dashboard.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
