// generator dropdown component,
//i must fetch the list of generators from supabase and display them in a dropdown menu
//1st step is to create a function GeneratorDropdown
// define state to hold the list of generators
//2nd step is to use useEffect to fetch the list of generators from supabase when the component mounts
//3rd step is to render a select element with options for each generator
// 4th send it to the parent component and add promptly to the add-new-project page

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
    <div>
      <label className="flex flex-col ">
        Generator:
        <select
          className="pr-4 mr-4"
          value="{value }"
          onChange={(e) => onChange(e.target.value)}
        >
          {generators.map((g) => (
            <option className="pr-4 mr-4" key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
