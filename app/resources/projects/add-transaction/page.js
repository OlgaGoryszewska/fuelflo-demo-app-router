'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Fuel, MapPin, Search } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import formatDateShort from '@/components/FormatDateShort';

const PROJECTS_CACHE_KEY = 'offline_active_projects';

export default function AddTransactionProjectPickerPage() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );

  useEffect(() => {
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
              'No projects saved offline yet. Open projects once with internet before going to the field.'
            );
          }

          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('projects')
          .select('id, name, location, start_date')
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

  const filteredProjects = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return projects;

    return projects.filter((project) => {
      const name = project.name?.toLowerCase() || '';
      const location = project.location?.toLowerCase() || '';

      return name.includes(searchText) || location.includes(searchText);
    });
  }, [projects, query]);

  return (
    <div className="main-container">
      <div className="form-header">
        <h1 className="ml-2">Add transaction</h1>
      </div>

      <div className="background-container">
        <div className="mb-3">
          <h2>Choose project</h2>
          <p className="steps-text mt-1">
            Pick the project for this fuel transaction.
          </p>
        </div>

        <div className="relative mb-4">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#717887]"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects or locations"
            className="!pl-12"
          />
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

        {!loading && filteredProjects.length > 0 && (
          <div className="flex flex-col gap-3">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/resources/projects/${project.id}/new`}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition active:scale-[0.98] active:border-[#62748e] active:bg-[#eef4fb]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                  <Fuel size={21} strokeWidth={2.2} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-semibold text-gray-900">
                    {project.name}
                  </span>

                  {project.location && (
                    <span className="mt-1 flex items-center gap-1 text-sm text-[#717887]">
                      <MapPin size={14} />
                      <span className="truncate">{project.location}</span>
                    </span>
                  )}

                  {project.start_date && (
                    <span className="steps-text mt-1 block">
                      Starts {formatDateShort(project.start_date)}
                    </span>
                  )}
                </span>

                <ArrowRight className="h-5 w-5 shrink-0 text-[#62748e]" />
              </Link>
            ))}
          </div>
        )}

        {!loading && projects.length > 0 && filteredProjects.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="steps-text">No projects match your search.</p>
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
