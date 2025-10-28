'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function OngoingProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setError(null);
      const { data, error } = await supabase
        .from('projects')
        .select('id, name'); // if you don't have is_active yet, use 'id, name'

      if (error) setError(error.message);
      setProjects(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="main-container">
      <div>
        <div className="form-header mb-4">
          <span className="material-symbols-outlined big">workspaces</span>
          <h1 className="ml-2">Ongoing Projects</h1>
        </div>
        <ul className="flex flex-col gap-2">
          {projects.map((p) => (
            <li className="card-button" key={p.id}>
              {' '}
              <span className="material-symbols-outlined">workspaces</span>
              <Link href={`/ongoing-projects-page/${p.id}`}>{p.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
