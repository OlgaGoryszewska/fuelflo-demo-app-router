'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ManagerDropdown({ value, onChange }) {
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    async function fetchManagers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('role', 'manager'); // 👈 only difference

      if (error) {
        console.error('Error fetching managers:', error.message);
      } else {
        setManagers(data || []);
      }
    }

    fetchManagers();
  }, []);

  return (
    <div className="w-full">
      <label className="flex flex-col w-full">
        <select
          className="pr-4 mr-4 w-full b-white h-[40px]"
          value={value}
          onChange={(e) => {
            const selectedId = e.target.value;

            if (!selectedId) {
              onChange(null);
              return;
            }

            const selectedManager = managers.find(
              (m) => String(m.id) === selectedId
            );

            onChange({
              id: selectedManager?.id,
              name: selectedManager?.full_name,
            });
          }}
        >
          <option value=""></option>

          {managers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
