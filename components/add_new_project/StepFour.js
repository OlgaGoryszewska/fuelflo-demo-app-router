'use client';

import CurrencyInput from 'react-currency-input-field';
import { BadgeCent, CircleDollarSign, Fuel, Lightbulb } from 'lucide-react';
import { getExpectedEarnings, getMargin } from './projectForm';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-[#b7791f]">{message}</p>;
}

function formatMoney(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return 'Missing';
  }

  return `${Number(value).toFixed(2)} SAR`;
}

function formatPrice(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return 'Missing';
  }

  return `${Number(value).toFixed(2)} SAR/L`;
}

export default function StepFour({ formData, setFormData, errors = {} }) {
  function handleChange(value, name) {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || '',
    }));
  }

  const margin = getMargin(formData);
  const expectedEarnings = getExpectedEarnings(formData);

  return (
    <section className="m-4">
      <div className="mb-5 rounded-[24px] border border-[#e8edf3] bg-white/85 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff7e6] text-[#f25822] ring-1 ring-[#fee39f]">
            <CircleDollarSign size={22} strokeWidth={2.3} />
          </span>
          <div>
            <h2>Fuel plan</h2>
            <p className="steps-text mt-1">
              Set the expected litres and margin that power the project
              dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <label>
          Expected litres
          <CurrencyInput
            id="expected_liters"
            name="expected_liters"
            placeholder="Expected fuel volume"
            decimalsLimit={2}
            suffix=" L"
            value={formData.expected_liters}
            onValueChange={(value) => handleChange(value, 'expected_liters')}
            className="border rounded p-2 w-full"
          />
          <FieldError message={errors.expected_liters} />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label>
            Purchase price
            <CurrencyInput
              id="amount"
              name="amount"
              placeholder="Supplier price"
              decimalsLimit={2}
              prefix="SAR "
              value={formData.amount}
              onValueChange={(value) => handleChange(value, 'amount')}
              className="border rounded p-2 w-full"
            />
            <FieldError message={errors.amount} />
          </label>

          <label>
            Selling price
            <CurrencyInput
              id="selling_price"
              name="selling_price"
              placeholder="Customer price"
              decimalsLimit={2}
              prefix="SAR "
              value={formData.selling_price}
              onValueChange={(value) => handleChange(value, 'selling_price')}
              className="border rounded p-2 w-full"
            />
            <FieldError message={errors.selling_price} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
              <BadgeCent size={19} strokeWidth={2.3} />
            </span>
            <p className="text-lg font-semibold text-[var(--primary-black)]">
              {formatPrice(margin)}
            </p>
            <p className="steps-text mt-1">Margin per litre</p>
          </div>

          <div className="rounded-[22px] border border-[#d7edce] bg-[#f3fbef] p-4">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2f8f5b] ring-1 ring-[#d7edce]">
              <Fuel size={19} strokeWidth={2.3} />
            </span>
            <p className="text-lg font-semibold text-[var(--primary-black)]">
              {formatMoney(expectedEarnings)}
            </p>
            <p className="steps-text mt-1">Expected margin</p>
          </div>
        </div>

        <label>
          Project specification
          <textarea
            name="specification"
            value={formData.specification}
            onChange={(event) =>
              handleChange(event.target.value, event.target.name)
            }
            placeholder="Fuel scope, event requirements, billing notes"
            className="min-h-24 w-full rounded-[10px] border border-[var(--primary-gray-light)] bg-white p-3 text-base text-[var(--slate-dark)]"
          />
          <FieldError message={errors.specification} />
        </label>

        <label>
          Additional note
          <textarea
            name="additional"
            value={formData.additional}
            onChange={(event) =>
              handleChange(event.target.value, event.target.name)
            }
            placeholder="Gate access, delivery windows, site rules, supplier constraints"
            className="min-h-28 w-full rounded-[10px] border border-[var(--primary-gray-light)] bg-white p-3 text-base text-[var(--slate-dark)]"
          />
          <FieldError message={errors.additional} />
        </label>

        <div className="rounded-[22px] border border-[#fee39f] bg-[#fff7e6] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#f25822] ring-1 ring-[#fee39f]">
              <Lightbulb size={19} strokeWidth={2.3} />
            </span>
            <p className="steps-text">
              A positive margin and expected litres are required because the
              project dashboard calculates expected earnings, savings, and
              pricing opportunities from these fields.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
