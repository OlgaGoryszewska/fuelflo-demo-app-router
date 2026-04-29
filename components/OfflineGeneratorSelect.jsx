'use client';

import { useEffect, useState } from 'react';
import { getGenerators } from '@/lib/offline/fieldData';

export default function OfflineGeneratorSelect({ formData, setFormData }) {
  const [generators, setGenerators] = useState([]);

  useEffect(() => {
    const data = getGenerators();
    setGenerators(data);
  }, []);

  return (
    <select
      value={formData.generator_id || ''}
      onChange={(e) => {
        const selected = generators.find((g) => g.id === e.target.value);

        if (selected) {
          setFormData((prev) => ({
            ...prev,
            generator_id: selected.id,
            generator_name: selected.name,
          }));
        }
      }}
      className="mb-4"
    >
      <option value="">Select generator (offline)</option>

      {generators.map((g) => (
        <option key={g.id} value={g.id}>
          {g.name}
        </option>
      ))}
    </select>
  );
}
