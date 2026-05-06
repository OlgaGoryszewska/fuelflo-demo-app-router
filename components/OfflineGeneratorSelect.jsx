'use client';

import { useState } from 'react';
import { getGenerators } from '@/lib/offline/fieldData';

export default function OfflineGeneratorSelect({ formData, setFormData }) {
  const [generators] = useState(() =>
    typeof localStorage === 'undefined' ? [] : getGenerators()
  );

  return (
    <select
      value={formData.generator_id || ''}
      onChange={(e) => {
        const selected = generators.find(
          (g) => String(g.id) === String(e.target.value)
        );

        if (selected) {
          setFormData((prev) => ({
            ...prev,
            generator_id: selected.id,
            generator_name: selected.name,
          }));
        }
      }}
      className="h-12"
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
