'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function RoleDashboard({
  eyebrow,
  title,
  description,
  primaryActions = [],
  sections = [],
  utilityLinks = [],
}) {
  const [openSection, setOpenSection] = useState(sections[0]?.id ?? null);

  function toggleSection(sectionId) {
    setOpenSection((current) => (current === sectionId ? null : sectionId));
  }

  return (
    <main className="main-container">
      <div className="form-header">
        <h1 className="ml-2">{eyebrow}</h1>
      </div>

      <div className="background-container">
        <div className="mb-4">
          <h2>{title}</h2>
          <p className="steps-text mt-1">{description}</p>
        </div>

        {primaryActions.length > 0 && (
          <div className="mb-4 grid grid-cols-1 gap-3">
            {primaryActions.map((item) => (
              <DashboardLink key={item.href} item={item} variant="primary" />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSection === section.id;

            return (
              <section
                key={section.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 p-4 text-left transition active:bg-[#eef4fb]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                    <Icon size={21} strokeWidth={2.2} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-gray-900">
                      {section.title}
                    </span>
                    {section.description && (
                      <span className="steps-text mt-1 block">
                        {section.description}
                      </span>
                    )}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#717887] transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-3 pb-3">
                    <div className="flex flex-col gap-2 pt-3">
                      {section.items.map((item) => (
                        <DashboardLink key={item.href} item={item} />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {utilityLinks.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
            {utilityLinks.map((item) => (
              <DashboardLink key={item.href} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function DashboardLink({ item, variant = 'default' }) {
  const Icon = item.icon;
  const isPrimary = variant === 'primary';

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-2xl border p-4 shadow-sm transition active:scale-[0.98] ${
        isPrimary
          ? 'border-[#d5eefc] bg-[#eef4fb] text-gray-900 ring-1 ring-white/70 active:border-[#62748e] active:bg-[#dbeaf5]'
          : 'border-gray-100 bg-white text-gray-900 active:border-[#62748e] active:bg-[#eef4fb]'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${
          isPrimary
            ? 'bg-white text-[#62748e] ring-[#d5eefc]'
            : 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]'
        }`}
      >
        <Icon size={21} strokeWidth={2.2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-gray-900">
          {item.label}
        </span>
        {item.description && (
          <span
            className={`mt-1 block text-sm ${
              isPrimary ? 'text-[#62748e]' : 'text-[#717887]'
            }`}
          >
            {item.description}
          </span>
        )}
      </span>
    </Link>
  );
}
