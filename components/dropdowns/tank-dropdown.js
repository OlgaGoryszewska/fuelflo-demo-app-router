'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
    <div className="relative w-full">
      <select
        className="h-12 w-full appearance-none pr-11"
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
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#717887]"
      />
    </div>
  );
}
