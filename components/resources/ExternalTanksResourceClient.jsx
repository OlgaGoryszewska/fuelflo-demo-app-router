'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileText, Fuel, Hash, Layers } from 'lucide-react';
import { saveTanks } from '@/lib/offline/fieldData';
import {
  DetailLine,
  ResourceEmptyState,
  ResourceError,
  ResourcePageShell,
  ResourceSearch,
  StatTile,
} from '@/components/resources/ResourceListUi';

const ADD_TANK_HREF = '/add-forms/add_equipment/external-tank';

function formatValue(value, suffix = '') {
  if (value === null || value === undefined || value === '') return 'Missing';

  return `${value}${suffix}`;
}

function matchesTank(tank, searchText) {
  const fields = [tank.name, tank.tank_nr, tank.tank_type, tank.notes];

  return fields.some((field) =>
    String(field || '')
      .toLowerCase()
      .includes(searchText)
  );
}

function TankCard({ tank }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
            <Fuel size={22} strokeWidth={2.2} />
          </span>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-gray-900">
              {tank.name || 'Unnamed tank'}
            </h3>
            <p className="steps-text mt-1">
              Tank {tank.tank_nr || 'not assigned'}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-[#d5eefc] bg-[#f5fbff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#62748e]">
          Tank
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          icon={Fuel}
          label="Capacity"
          value={formatValue(tank.capacity_liters, ' L')}
        />
        <StatTile
          icon={Layers}
          label="Type"
          value={formatValue(tank.tank_type)}
        />
        <StatTile
          icon={Hash}
          label="Tank no"
          value={formatValue(tank.tank_nr)}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-gray-100 bg-white px-3">
        <DetailLine label="Tank number" value={tank.tank_nr} />
        <DetailLine label="Tank type" value={tank.tank_type} />
        <DetailLine
          label="Capacity"
          value={formatValue(tank.capacity_liters, ' L')}
        />
        {tank.notes && <DetailLine label="Notes" value={tank.notes} />}
      </div>
    </article>
  );
}

export default function ExternalTanksResourceClient({ tanks, errorMessage }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (tanks.length > 0) {
      saveTanks(
        tanks.map((tank) => ({
          id: tank.id,
          name: tank.name,
        }))
      );
    }
  }, [tanks]);

  const filteredTanks = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return tanks;

    return tanks.filter((tank) => matchesTank(tank, searchText));
  }, [tanks, query]);

  return (
    <ResourcePageShell
      title="External tanks"
      eyebrow="Fuel storage"
      description="Tank records used as fuel sources and return destinations."
      count={tanks.length}
      actionHref={ADD_TANK_HREF}
      actionLabel="Add external tank"
    >
      <ResourceError message={errorMessage} />

      <ResourceSearch
        value={query}
        onChange={setQuery}
        placeholder="Search tanks, numbers, or type"
      />

      {!errorMessage && tanks.length === 0 && (
        <ResourceEmptyState
          icon={Fuel}
          title="No external tanks yet"
          description="Add a tank before recording deliveries or returns."
          actionHref={ADD_TANK_HREF}
          actionLabel="Add external tank"
        />
      )}

      {!errorMessage && tanks.length > 0 && filteredTanks.length === 0 && (
        <ResourceEmptyState
          icon={FileText}
          title="No matching tanks"
          description="Try a different tank name, number, or type."
          actionHref={ADD_TANK_HREF}
          actionLabel="Add external tank"
        />
      )}

      {!errorMessage && filteredTanks.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {filteredTanks.map((tank) => (
            <TankCard key={tank.id} tank={tank} />
          ))}
        </div>
      )}
    </ResourcePageShell>
  );
}
