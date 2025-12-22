'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function EventOrganizersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setError(null);
      const { data, error } = await supabase
        .from('fuel_suppliers')
        .select('name, id')
        .order('name', { ascending: true });

      if (error) setError(error.message);
      console.log('Data from Supabase:', data);
      setSuppliers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="m-2.5">
      <div className="form-header mb-4">
        <h1 className="ml-2">fuel suppliers</h1>
      </div>
      <div className="background-container-white">
        <ul>
          {suppliers.map((s) => (
            <li key={supabase.id}>
              <span className="material-symbols-outlined">festival</span>{' '}
              <Link href={`/fuel_suppliers/${s.id}`}>
                {s.name ?? 'No name'}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
