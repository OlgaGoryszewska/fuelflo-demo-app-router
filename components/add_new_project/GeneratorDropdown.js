'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function GeneratorDropdown() {
  const [generators, setGenerators] = useState([]);
  useEffect(() => {
    async function fetchGenerators() {
      const { data, error } = await supabase
        .from('generators')
        .select('id, name');
      if (error) {
        console.error('Error fetching generators:', error);
      } else {
        setGenerators(data || [] );
      }
    }
    fetchGenerators();
  }, []);

  return (
    <div>
      <select>
        {generators.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </div>
  );
}
