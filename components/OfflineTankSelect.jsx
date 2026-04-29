'use client';

import { useEffect, useState } from 'react';
import { getTanks } from '@/lib/offline/fieldData';

export default function OfflineTankSelect({ formData, setFormData }) {
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    const data = getTanks();
    setTanks(data);
  }, []);

  return (
    <select
      value={formData.tank_id || ''}
      onChange={(e) => {
        const selected = tanks.find((tank) => tank.id === e.target.value);

        if (selected) {
          setFormData((prev) => ({
            ...prev,
            tank_id: selected.id,
            tank_name: selected.name,
          }));
        }
      }}
      className="mb-4"
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