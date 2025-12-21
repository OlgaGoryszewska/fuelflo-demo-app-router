'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function EventOrganizersPage() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setError(null);
      const { data, error } = await supabase
        .from('event_organizers')
        .select('id', 'name')
        .order('name', { ascending: true });

      if (error) setError(error.message);
      setOrganizers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="m-2.5">
      <div className="form-header mb-4">
        <h1 className="ml-2">event organizers</h1>
      </div>
      <div className="background-container-white">
        <ul>
          {organizers.map((o) => (
            <li key={o.id}>
              <span className="material-symbols-outlined">festival</span>{' '}
              <Link href={`/event_organizers/${o.id}`}>{o.name ?? '(No name)'}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
