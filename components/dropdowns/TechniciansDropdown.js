'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TechniciansDropdown({ value, onChange }) {
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    async function fetchTechnicians() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('role', 'technician');

      if (error) {
        console.error('Error fetching technicians:', error.message);
      } else {
        setTechnicians(data || []);
      }
    }

    fetchTechnicians();
  }, []);

  return (
    <div className="w-full">
      <label className="flex flex-col w-full">
        <select
          className="pr-4 mr-4 w-full b-white"
          value={value}
          onChange={(e) => {
            const selectedId = e.target.value;

            if (!selectedId) {
              onChange(null);
              return;
            }

            const selectedTechnician = technicians.find(
              (t) => String(t.id) === selectedId
            );

            onChange({
              id: selectedTechnician?.id,
              name: selectedTechnician?.full_name,
            });
          }}
        >
          <option value="">Select Technician</option>

          {technicians.map((t) => (
            <option key={t.id} value={t.id}>
              {t.full_name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
