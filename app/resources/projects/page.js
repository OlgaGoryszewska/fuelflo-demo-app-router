'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  FolderKanban,
  MapPin,
  Search,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { loadActiveProjectsWithCache } from '@/lib/offline/activeProjectsCache';
import formatDateShort from '@/components/FormatDateShort';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function OngoingProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState('');
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  const [query, setQuery] = useState('');

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
      setWarning('');

      const result = await loadActiveProjectsWithCache(supabase, {
        offlineEmptyMessage:
          'No projects saved offline yet. Open this page once with internet before going to the field.',
      });

      setProjects(result.projects);
      setIsOfflineData(result.isOfflineData);
      setWarning(result.warning);
      setError(result.error || null);
      setLoading(false);
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
    <main className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Projects</p>
      </div>

      <section className="mb-4 rounded-[28px] border border-[#d9e2ec] bg-gradient-to-br from-white via-[#f8fbff] to-[#d5eefc] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">
              Ongoing work
            </p>
            <h2 className="mt-1">Active projects</h2>
            <p className="steps-text mt-1">
              Review project details, locations, and start dates.
            </p>
          </div>

          {!loading && (
            <div className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-[#62748e] ring-1 ring-white">
              {projects.length}
            </div>
          )}
        </div>
      </section>

      <section className="background-container-white mb-4">
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
          <div className="mb-4 rounded-[22px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
            <strong>Offline mode</strong>
            <p className="mt-1">
              Showing saved projects only. New fuel transactions will be saved
              locally and synced later.
            </p>
          </div>
        )}

        {isOfflineData && isOnline && warning && (
          <div className="mb-4 rounded-[22px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
            {warning}
          </div>
        )}

        {loading && <LoadingIndicator />}

        {error && (
          <div className="mb-4 rounded-[22px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && filteredProjects.length > 0 && (
          <div className="flex flex-col gap-3">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/resources/projects/${project.id}`}
                className="flex items-center gap-3 rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)] transition active:scale-[0.98] active:border-[#62748e] active:bg-[#eef4fb]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                  <FolderKanban size={21} strokeWidth={2.2} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 truncate text-base font-semibold text-gray-900">
                      {project.name}
                    </h3>

                    <div className="shrink-0 rounded-full border border-[#d7edce] bg-[#f3fbef] px-2.5 py-1 text-xs font-semibold text-[#2f8f5b]">
                      Active
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-1">
                    {project.location && (
                      <p className="flex items-center gap-1 text-sm text-[#717887]">
                        <MapPin size={14} />
                        <span className="truncate">{project.location}</span>
                      </p>
                    )}

                    {project.start_date && (
                      <p className="flex items-center gap-1 text-sm text-[#717887]">
                        <CalendarDays size={14} />
                        <span>
                          Starts {formatDateShort(project.start_date)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 shrink-0 text-[#62748e]" />
              </Link>
            ))}
          </div>
        )}

        {!loading && projects.length > 0 && filteredProjects.length === 0 && (
          <div className="rounded-[22px] border border-[#e8edf3] bg-white p-4">
            <p className="steps-text">No projects match your search.</p>
          </div>
        )}

        {!loading && projects.length === 0 && !error && (
          <div className="rounded-[22px] border border-[#e8edf3] bg-white p-4">
            <p className="steps-text">No active projects found.</p>
          </div>
        )}
      </section>
    </main>
  );
}
