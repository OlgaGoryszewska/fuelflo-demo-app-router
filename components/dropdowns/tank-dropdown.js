'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function TankDropdown({ value, onChange }) {
  const [tanks, setTanks] = useState([]);
  useEffect(() => {
    async function fetchTanks() {
      const { data, error } = await supabase.from('tanks').select('id, name');
      if (error) {
        console.error('Error fetching tanks:', error);
      } else {
        setTanks(data || []);
      }
    }
    fetchTanks();
  }, []);

  return (
    <div className="w-full">
      <label className="flex flex-col w-full">
        <select
          className="pr-4 mr-4 w-full b-white"
          value="{value }"
          onChange={(e) => onChange(e.target.value)}
        >
          <option value=""> Select Tank </option>
          {tanks.map((t) => (
            <option className="pr-4 mr-4 b-white" key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
