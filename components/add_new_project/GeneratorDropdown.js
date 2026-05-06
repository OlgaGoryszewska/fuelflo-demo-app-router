'use client';
import { useEffect, useState } from 'react';
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
    <div className="w-full ">
      <label className="flex flex-col w-full">
        <select
          className="b-white mr-4 h-12 w-full pr-4"
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
      </label>
    </div>
  );
}
