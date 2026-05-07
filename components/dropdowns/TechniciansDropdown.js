'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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

          const selectedTechnician = technicians.find(
            (t) => String(t.id) === selectedId
          );

          onChange({
            id: selectedTechnician?.id,
            name: selectedTechnician?.full_name,
          });
        }}
      >
        <option value="">Select technician</option>

        {technicians.map((t) => (
          <option key={t.id} value={t.id}>
            {t.full_name}
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
