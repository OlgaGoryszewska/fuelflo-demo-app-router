'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function TankDropdown({ value, onChange }) {
  const [tank, setTank] = useState([]);

  useEffect(() => {
    async function fetchTank() {
      const { data, error } = await supabase.from('tanks').select('id, name');
      if (error) {
        console.error('Error fetching tanks:', error);
      } else {
        setTank(data || []);
      }
    }
    fetchTank();
  }, []);

  return (
    <div className="w-full">
      <label className="flex flex-col w-full">
        <select
          className="pr-4 mr-4 w-full b-white"
          value={value}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedTank = tank.find(
              (g) => g.id.toString() === selectedId
            );

            onChange({
              id: selectedTank?.id,
              name: selectedTank?.name,
            });
            console.log('tank:', selectedId);
          }}
        >
          <option value=""> Select Tank </option>
          {tank.map((t) => (
            <option className="pr-4 mr-4 b-white" key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
