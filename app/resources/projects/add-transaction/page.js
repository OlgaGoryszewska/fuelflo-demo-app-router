'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Fuel,
  MapPin,
  Search,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { loadActiveProjectsWithCache } from '@/lib/offline/activeProjectsCache';
import formatDateShort from '@/components/FormatDateShort';
import LoadingIndicator from '@/components/LoadingIndicator';

function Notice({ tone = 'warning', title, children }) {
  const styles =
    tone === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-[#fee39f] bg-[#fff7e6] text-[#9a5f12]';

  return (
    <div className={`mb-4 rounded-[22px] border p-4 text-sm ${styles}`}>
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? 'mt-1' : ''}>{children}</div>}
    </div>
  );
}

export default function AddTransactionProjectPickerPage() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState('');
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
      setWarning('');

      const result = await loadActiveProjectsWithCache(supabase);

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
        <p className="page-kicker">Fuel transaction</p>
      </div>

      <section className="mb-4 rounded-[28px] border border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fee39f] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">
              Start evidence capture
            </p>
            <h2 className="mt-2">Choose project</h2>
            <p className="steps-text mt-1">
              Pick the active project before recording a delivery or return.
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#f25822] ring-1 ring-white">
            <Fuel size={23} strokeWidth={2.4} />
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-3">
            <p className="steps-text flex items-center gap-2">
              <CheckCircle2 size={16} />
              Active projects
            </p>
            <p className="mt-1 text-xl font-semibold text-[var(--primary-black)]">
              {loading ? '-' : projects.length}
            </p>
          </div>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-3">
            <p className="steps-text flex items-center gap-2">
              {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
              Save mode
            </p>
            <p className="mt-1 text-xl font-semibold text-[var(--primary-black)]">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
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
          <Notice title="Offline mode">
            <p className="mt-1">
              Showing saved projects only. New fuel transactions will be saved
              locally and synced later.
            </p>
          </Notice>
        )}

        {isOfflineData && isOnline && warning && (
          <Notice>{warning}</Notice>
        )}

        {loading && <LoadingIndicator />}

        {error && (
          <Notice tone="error">{error}</Notice>
        )}

        {!loading && filteredProjects.length > 0 && (
          <div className="flex flex-col gap-3">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/resources/projects/${project.id}/new`}
                className="flex items-center gap-3 rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)] transition active:scale-[0.98] active:border-[#62748e] active:bg-[#eef4fb]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                  <Fuel size={21} strokeWidth={2.2} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="block min-w-0 truncate text-base font-semibold text-gray-900">
                      {project.name}
                    </span>
                    <span className="shrink-0 rounded-full border border-[#d7edce] bg-[#f3fbef] px-2.5 py-1 text-xs font-semibold text-[#2f8f5b]">
                      Active
                    </span>
                  </span>

                  <span className="mt-2 flex flex-col gap-1">
                    {project.location && (
                      <span className="flex items-center gap-1 text-sm text-[#717887]">
                        <MapPin size={14} />
                        <span className="truncate">{project.location}</span>
                      </span>
                    )}

                    {project.start_date && (
                      <span className="flex items-center gap-1 text-sm text-[#717887]">
                        <CalendarDays size={14} />
                        <span>Starts {formatDateShort(project.start_date)}</span>
                      </span>
                    )}
                  </span>
                </span>

                <ArrowRight className="h-5 w-5 shrink-0 text-[#62748e]" />
              </Link>
            ))}
          </div>
        )}

        {!loading && projects.length > 0 && filteredProjects.length === 0 && (
          <div className="rounded-[22px] border border-[#e8edf3] bg-white p-4">
            <p className="text-sm font-semibold text-[var(--primary-black)]">
              No projects match your search.
            </p>
            <p className="steps-text mt-1">
              Try the project name, venue, or location.
            </p>
          </div>
        )}

        {!loading && projects.length === 0 && !error && (
          <div className="rounded-[22px] border border-[#e8edf3] bg-white p-4">
            <p className="text-sm font-semibold text-[var(--primary-black)]">
              No active projects found.
            </p>
            <p className="steps-text mt-1">
              Create or activate a project before starting a fuel transaction.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
