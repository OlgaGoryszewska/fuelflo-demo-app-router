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
        <div className="form-header ">
          <h1 className="ml-2">Projects</h1>
        </div>
        <div className='background-container'>
           <h2>Choose a project</h2>
        <p className="steps-text mb-2">Before adding fuel transaction </p>
        <ul className="flex flex-col gap-1 ">
          {projects.map((p) => (
            <li className="file-row" key={p.id}>
              {' '}
              <Link href={`/resources/projects/${p.id}`}>{p.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
}
