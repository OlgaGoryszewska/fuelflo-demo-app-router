'use client';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function GeneratorDropdown({ value, onChange }) {
  const [generators, setGenerators] = useState([]);

  useEffect(() => {
    async function fetchGenerators() {
      const { data, error } = await supabase
        .from('generators')
        .select('id, name');

      if (error) {
        console.error('Error fetching generators:', error);
      } else {
        setGenerators(data || []);
      }
    }

    fetchGenerators();
  }, []);

  return (
    <div className="relative w-full">
      <select
        className="h-12 w-full appearance-none pr-11"
        value={value || ''}
        onChange={(e) => {
          const selectedId = e.target.value;

          if (!selectedId) {
            onChange({ id: '', name: '' });
            return;
          }

          const selectedGenerator = generators.find(
            (g) => g.id.toString() === selectedId
          );

          onChange({
            id: selectedGenerator?.id,
            name: selectedGenerator?.name,
          });
        }}
      >
        <option value="">Select generator</option>
        {generators.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
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
