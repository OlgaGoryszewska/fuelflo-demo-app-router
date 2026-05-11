'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  MapPin,
  Search,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import formatDateShort from '@/components/FormatDateShort';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function ReportProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('projects')
        .select(
          `
          id,
          name,
          location,
          start_date,
          end_date,
          active,
          expected_liters,
          contractor_name
        `
        )
        .order('start_date', { ascending: false });

      if (error) {
        setError(error.message);
        setProjects([]);
      } else {
        setProjects(data || []);
      }

      setLoading(false);
    }

    load();
  }, []);

  const filteredProjects = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    if (!searchText) return projects;

    return projects.filter((project) => {
      const haystack = [
        project.name,
        project.location,
        project.contractor_name,
        project.active ? 'active' : 'inactive',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchText);
    });
  }, [projects, query]);

  return (
    <main className="mx-auto w-full max-w-[760px] px-3 py-4">
      <Link
        href="/resources/reports"
        className="mb-3 inline-flex h-10 items-center gap-2 rounded-full border border-[#d5eefc] bg-white px-3 text-sm font-semibold text-[#62748e] shadow-sm transition active:scale-[0.98]"
      >
        <ArrowLeft size={16} strokeWidth={2.3} />
        Back
      </Link>

      <div className="mb-3 px-1">
        <p className="page-kicker">Reports</p>
      </div>

      <section className="background-container-white mb-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="page-kicker">Project report</p>
            <h2 className="mt-1">Choose project</h2>
            <p className="steps-text mt-1">
              Open a project report view, then download a shareable PDF.
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
            <ClipboardList size={21} strokeWidth={2.3} />
          </span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-[20px] border border-[#e8edf3] bg-[#f8fbff] p-3">
            <p className="steps-text">Projects</p>
            <p className="mt-1 text-xl font-semibold text-[var(--primary-black)]">
              {projects.length}
            </p>
          </div>
          <div className="rounded-[20px] border border-[#d7edce] bg-[#f3fbef] p-3">
            <p className="steps-text">Active</p>
            <p className="mt-1 text-xl font-semibold text-[#2f8f5b]">
              {projects.filter((project) => project.active).length}
            </p>
          </div>
        </div>

        <label className="relative mb-4 block">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa8b6]"
            size={17}
            strokeWidth={2.2}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search project, client, location"
            className="!h-12 !pl-12 !pr-4"
          />
        </label>

        {loading && <LoadingIndicator />}

        {error && (
          <div className="rounded-[24px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
            {error}
          </div>
        )}

        {!loading && !error && filteredProjects.length === 0 && (
          <div className="rounded-[24px] border border-[#e8edf3] bg-white p-4">
            <p className="text-sm font-semibold text-[var(--primary-black)]">
              No matching projects.
            </p>
            <p className="steps-text mt-1">
              Try another project, organizer, or location.
            </p>
          </div>
        )}

        {!loading && !error && filteredProjects.length > 0 && (
          <ul className="flex w-full flex-col gap-2">
            {filteredProjects.map((project) => (
              <li key={project.id} className="w-full">
                <Link
                  href={`/resources/reports/projects/${project.id}`}
                  className="flex items-center gap-3 rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)] transition active:scale-[0.98]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                    <ClipboardList size={21} strokeWidth={2.2} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[var(--primary-black)]">
                      {project.name || 'Unnamed project'}
                    </span>
                    {project.location && (
                      <span className="steps-text mt-1 flex items-center gap-1 truncate">
                        <MapPin size={14} />
                        <span className="truncate">{project.location}</span>
                      </span>
                    )}
                    <span className="steps-text mt-2 flex items-center gap-1">
                      <CalendarDays size={14} />
                      {formatDateShort(project.start_date)}
                    </span>
                  </span>

                  <span className="flex shrink-0 flex-col items-end gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        project.active
                          ? 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]'
                          : 'border-[#e8edf3] bg-[#f8fbff] text-[#62748e]'
                      }`}
                    >
                      {project.active ? 'Active' : 'Inactive'}
                    </span>
                    <ArrowRight className="text-[#aab6c3]" size={17} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
