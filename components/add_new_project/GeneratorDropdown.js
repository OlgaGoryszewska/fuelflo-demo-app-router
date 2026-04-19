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
          className="pr-4 mr-4 w-full b-white"
          value={value}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedGenerator = generators.find(
              (g) => g.id.toString() === selectedId
            );

            onChange({
              id: selectedGenerator?.id,
              name: selectedGenerator?.name,
            });
            console.log('generator:', selectedId);
          }}
        >
          <option value="">Select Generator</option>
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
