'use client';

import { useState } from 'react';
import { getTanks } from '@/lib/offline/fieldData';

export default function OfflineTankSelect({ formData, setFormData }) {
  const [tanks] = useState(() =>
    typeof localStorage === 'undefined' ? [] : getTanks()
  );

  return (
    <select
      value={formData.tank_id || ''}
      onChange={(e) => {
        const selected = tanks.find(
          (tank) => String(tank.id) === String(e.target.value)
        );

        if (selected) {
          setFormData((prev) => ({
            ...prev,
            tank_id: selected.id,
            tank_name: selected.name,
          }));
        }
      }}
      className="h-12"
    >
      <option value="">Select tank (offline)</option>

      {tanks.map((tank) => (
        <option key={tank.id} value={tank.id}>
          {tank.name}
        </option>
      ))}
    </select>
  );
}
