'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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

          const selectedManager = managers.find(
            (m) => String(m.id) === selectedId
          );

          onChange({
            id: selectedManager?.id,
            name: selectedManager?.full_name,
          });
        }}
      >
        <option value="">Select manager</option>

        {managers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.full_name}
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
