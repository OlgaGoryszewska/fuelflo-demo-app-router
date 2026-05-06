'use client';

import { Fuel, RotateCcw } from 'lucide-react';

export default function MyToggleComponent({ value, onChange }) {
  const options = [
    {
      value: 'delivery',
      label: 'Delivery',
      description: 'Fuel added to equipment',
      icon: Fuel,
    },
    {
      value: 'return',
      label: 'Return',
      description: 'Fuel returned from equipment',
      icon: RotateCcw,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const Icon = option.icon;
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left shadow-sm transition active:scale-[0.98] ${
              selected
                ? 'border-[#d5eefc] bg-[#eef4fb] ring-1 ring-[#d5eefc]'
                : 'border-gray-100 bg-white'
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${
                selected
                  ? 'bg-white text-[#62748e] ring-[#d5eefc]'
                  : 'bg-gray-50 text-[#717887] ring-gray-100'
              }`}
            >
              <Icon size={21} strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-base font-semibold text-gray-900">
                {option.label}
              </span>
              <span className="steps-text mt-1 block">
                {option.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
