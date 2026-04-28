'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import formatDateShort from '@/components/FormatDateShort';


const PROJECTS_CACHE_KEY = 'offline_active_projects';

export default function OngoingProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfflineData, setIsOfflineData] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const cachedProjects = localStorage.getItem(PROJECTS_CACHE_KEY);

        if (!navigator.onLine) {
          if (cachedProjects) {
            setProjects(JSON.parse(cachedProjects));
            setIsOfflineData(true);
          } else {
            setError(
              'No projects available offline yet. Please open this page once with internet before going to the field.'
            );
          }

          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('projects')
          .select('id, name, start_date')
          .eq('active', true)
          .order('start_date', { ascending: false });

        if (error) {
          throw error;
        }

        setProjects(data || []);
        setIsOfflineData(false);

        localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(data || []));
      } catch (err) {
        const cachedProjects = localStorage.getItem(PROJECTS_CACHE_KEY);

        if (cachedProjects) {
          setProjects(JSON.parse(cachedProjects));
          setIsOfflineData(true);
          setError('Could not refresh projects. Showing saved offline data.');
        } else {
          setError(err.message || 'Could not load projects.');
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="main-container">
      <div>
        <div className="form-header">
          <h1 className="ml-2">Projects</h1>
        </div>
        {!navigator.onLine && (
  <p className="mb-3 rounded border border-yellow-200 bg-yellow-50 p-2 text-sm text-yellow-700">
    Offline mode: showing saved projects only
  </p>
)}

        <div className="background-container">
          <h2>Choose a project</h2>
          <p className="steps-text mb-2">Before adding fuel transaction</p>

          {isOfflineData && (
            <p className="mb-3 rounded border border-yellow-200 bg-yellow-50 p-2 text-sm text-yellow-700">
              You are viewing saved offline projects.
            </p>
          )}

          {loading && <p className="steps-text">Loading projects...</p>}

          {error && (
            <p className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="divider-full"></div>

          <div className="pr-2 w-full flex justify-between">
            <h4 className="pl-2">Name</h4>
            <h4>Starting date</h4>
          </div>

          <ul className="flex flex-col gap-1">
            {projects.map((p) => (
              <li className="file-row" key={p.id}>
                <Link
                  className="steps-text"
                  href={`/resources/projects/${p.id}`}
                >
                  {p.name}
                </Link>

                <p className="steps-text">
                  {formatDateShort(p.start_date)}
                </p>
              </li>
            ))}
          </ul>

          {!loading && projects.length === 0 && !error && (
            <p className="steps-text mt-3">No active projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}