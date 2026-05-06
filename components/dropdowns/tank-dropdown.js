'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TankDropdown({ value, onChange }) {
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    async function fetchTanks() {
      const { data, error } = await supabase.from('tanks').select('id, name');

      if (error) {
        console.error('Error fetching tanks:', error.message);
      } else {
        setTanks(data || []);
      }
    }

    fetchTanks();
  }, []);

  return (
    <div className="w-full mb-4 ">
      <label className="flex w-full flex-col">
        <select
          className="b-white mr-4 h-12 w-full pr-4"
          value={value || ''}
          onChange={(e) => {
            const selectedId = e.target.value;

            if (!selectedId) {
              onChange(null);
              return;
            }

            const selectedTank = tanks.find(
              (t) => String(t.id) === String(selectedId)
            );

            if (!selectedTank) {
              onChange(null);
              return;
            }

            onChange({
              id: selectedTank.id,
              name: selectedTank.name,
            });
          }}
        >
          <option value="">Select external tank</option>

          {tanks.map((tank) => (
            <option key={tank.id} value={tank.id}>
              {tank.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
