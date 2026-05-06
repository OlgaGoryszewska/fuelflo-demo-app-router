'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Archive,
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import formatDateShort from '@/components/FormatDateShort';

export default function ArchivedProjectsPage() {
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
        .select('id, name, location, start_date')
        .eq('active', false)
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
      const name = project.name?.toLowerCase() || '';
      const location = project.location?.toLowerCase() || '';

      return name.includes(searchText) || location.includes(searchText);
    });
  }, [projects, query]);

  return (
    <div className="main-container">
      <div className="form-header">
        <h1 className="ml-2">Archived projects</h1>
      </div>

      <div className="background-container">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2>Archived projects</h2>
            <p className="steps-text mt-1">
              Review completed or inactive project records.
            </p>
          </div>

          {!loading && (
            <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[#62748e] ring-1 ring-[#d5eefc]">
              {projects.length}
            </div>
          )}
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
            placeholder="Search archived projects"
            className="!pl-12"
          />
        </div>

        {loading && (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="steps-text">Loading archived projects...</p>
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
                href={`/resources/projects/${project.id}`}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition active:scale-[0.98] active:border-[#62748e] active:bg-[#eef4fb]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-50 text-[#62748e] ring-1 ring-gray-200">
                  <Archive size={21} strokeWidth={2.2} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 truncate text-base font-semibold text-gray-900">
                      {project.name}
                    </h3>

                    <div className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                      Archived
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
                          Started {formatDateShort(project.start_date)}
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
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="steps-text">
              No archived projects match your search.
            </p>
          </div>
        )}

        {!loading && projects.length === 0 && !error && (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="steps-text">No archived projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
