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
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
              'No projects saved offline yet. Open this page once with internet before going to the field.'
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

        if (error) throw error;

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
      <div className="form-header">
        <h1 className="ml-2">Projects</h1>
      </div>

      <div className="background-container">
        <div className="mb-5">
          <h2>Choose a project</h2>
          <p className="steps-text mt-1">
            Select a project and start a fuel transaction.
          </p>
        </div>

        {!isOnline && (
          <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            <strong>Offline mode</strong>
            <p className="mt-1">
              Showing saved projects only. New fuel transactions will be saved
              locally and synced later.
            </p>
          </div>
        )}

        {isOfflineData && isOnline && (
          <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            Showing saved project data because refresh failed.
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="steps-text">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <Link href={`/resources/projects/${project.id}`}>
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-900">
                      {project.name}
                    </h3>

                    <p className="steps-text mt-1">
                      Starts {formatDateShort(project.start_date)}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center justify-between gap-3">
                  <Link
                    href={`/resources/projects/${project.id}`}
                    className="text-sm text-gray-500 underline"
                  >
                    View details
                  </Link>

                  <Link
                    href={`/resources/projects/${project.id}/new`}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
                  >
                    Add fuel
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && !error && (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="steps-text">No active projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
