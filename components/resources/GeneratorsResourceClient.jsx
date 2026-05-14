'use client';

import { useEffect, useMemo, useState } from 'react';
import { BatteryCharging, Fuel, Gauge, Hash, Zap } from 'lucide-react';
import { saveGenerators } from '@/lib/offline/fieldData';
import {
  DetailLine,
  ResourceEmptyState,
  ResourceError,
  ResourcePageShell,
  ResourceSearch,
  StatTile,
} from '@/components/resources/ResourceListUi';

const ADD_GENERATOR_HREF = '/add-forms/add_equipment/generator';

function formatValue(value, suffix = '') {
  if (value === null || value === undefined || value === '') return 'Missing';

  return `${value}${suffix}`;
}

function matchesGenerator(generator, searchText) {
  const fields = [
    generator.name,
    generator.fleet_no,
    generator.model_no,
    generator.prime_power,
  ];

  return fields.some((field) =>
    String(field || '')
      .toLowerCase()
      .includes(searchText)
  );
}

function GeneratorCard({ generator }) {
  return (
    <article className="rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
            <Zap size={22} strokeWidth={2.2} />
          </span>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-gray-900">
              {generator.name || 'Unnamed generator'}
            </h3>
            <p className="steps-text mt-1">
              Fleet {generator.fleet_no || 'not assigned'}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-[#d5eefc] bg-[#f5fbff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#62748e]">
          Generator
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          icon={Fuel}
          label="Capacity"
          value={formatValue(generator.fuel_capacity, ' L')}
        />
        <StatTile
          icon={Gauge}
          label="Consumption"
          value={formatValue(generator.fuel_consumption_100, ' L/H')}
        />
        <StatTile
          icon={BatteryCharging}
          label="Runtime"
          value={formatValue(generator.run_hours_100_load, ' H')}
        />
      </div>

      <div className="mt-4 rounded-[20px] border border-[#e8edf3] bg-white px-3">
        <DetailLine label="Model number" value={generator.model_no} />
        <DetailLine label="Prime power" value={generator.prime_power} />
        <DetailLine label="Fleet number" value={generator.fleet_no} />
        {generator.notes && <DetailLine label="Notes" value={generator.notes} />}
      </div>
    </article>
  );
}

export default function GeneratorsResourceClient({ generators, errorMessage }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (generators.length > 0) {
      saveGenerators(
        generators.map((generator) => ({
          id: generator.id,
          name: generator.name,
        }))
      );
    }
  }, [generators]);

  const filteredGenerators = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return generators;

    return generators.filter((generator) =>
      matchesGenerator(generator, searchText)
    );
  }, [generators, query]);

  return (
    <ResourcePageShell
      title="Generators"
      eyebrow="Fleet"
      description="Generator records used for projects and fuel transactions."
      count={generators.length}
      actionHref={ADD_GENERATOR_HREF}
      actionLabel="Add generator"
    >
      <ResourceError message={errorMessage} />

      <ResourceSearch
        value={query}
        onChange={setQuery}
        placeholder="Search generators, fleet, or model"
      />

      {!errorMessage && generators.length === 0 && (
        <ResourceEmptyState
          icon={Zap}
          title="No generators yet"
          description="Add a generator before assigning equipment to projects."
          actionHref={ADD_GENERATOR_HREF}
          actionLabel="Add generator"
        />
      )}

      {!errorMessage &&
        generators.length > 0 &&
        filteredGenerators.length === 0 && (
          <ResourceEmptyState
            icon={Hash}
            title="No matching generators"
            description="Try a different generator name, model, or fleet number."
            actionHref={ADD_GENERATOR_HREF}
            actionLabel="Add generator"
          />
        )}

      {!errorMessage && filteredGenerators.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {filteredGenerators.map((generator) => (
            <GeneratorCard key={generator.id} generator={generator} />
          ))}
        </div>
      )}
    </ResourcePageShell>
  );
}
