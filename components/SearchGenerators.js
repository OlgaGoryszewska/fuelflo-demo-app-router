
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function SearchGenerators() {
  const [generators, setGenerators] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchGenerators = async () => {
      if (!query) {
        setGenerators([]);
        return;
      }

      const { data, error } = await supabase
        .from('generators')
        .select('*')
        .ilike('name', `%${query}%`);

      if (error) {
        console.error('Error fetching generators:', error);
        setGenerators([]);
      } else {
        setGenerators(data || []);
      }
    };

    fetchGenerators();
  }, [query]); // 👈 run when query changes

  return (
    <div>
      <input
        type="text"
        placeholder="Search Generator by name..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <ul className='my-4'>
        {generators.map(gen => (
          <li key={gen.id}>{gen.name}</li>
        ))}
      </ul>
    </div>
  );
}
