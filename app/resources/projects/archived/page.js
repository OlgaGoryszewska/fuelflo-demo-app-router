'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import formatDateShort from '@/components/FormatDateShort';

export default function OngoingProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setError(null);
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, start_date') // if you don't have is_active yet, use 'id, name'
        .eq('active', false)
        .order('start_date', { ascending: false });

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
          <h1 className="ml-2">Archived projects</h1>
        </div>
        <div className="background-container">
          <div className="flex flex-col w-full"></div>
          <div className="pr-2 w-full flex justify-between">
            <h4 className="pl-2">Name</h4>
            <h4>Starting date</h4>
          </div>
          <ul className="flex flex-col gap-1 ">
            {projects.map((p) => (
              <li className="file-row " key={p.id}>
                <Link
                  className="steps-text"
                  href={`/resources/projects/${p.id}`}
                >
                  {p.name}
                </Link>
                <p className="steps-text "> {formatDateShort(p.start_date)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
