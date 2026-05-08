'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';
import formatDateShort from '@/components/FormatDateShort';
import LoadingIndicator from '@/components/LoadingIndicator';
import { supabase } from '@/lib/supabaseClient';
import avatar from '@/public/avatar.png';

function managerMatchesSearch(manager, searchText) {
  const values = [
    manager.full_name,
    manager.email,
    manager.phone,
    manager.address,
  ];

  return values.some((value) =>
    String(value || '')
      .toLowerCase()
      .includes(searchText)
  );
}

function buildProjectCounts(projects) {
  return projects.reduce((counts, project) => {
    if (!project.manager_id) return counts;

    const managerId = String(project.manager_id);
    const current = counts.get(managerId) || { total: 0, active: 0 };

    counts.set(managerId, {
      total: current.total + 1,
      active: current.active + (project.active ? 1 : 0),
    });

    return counts;
  }, new Map());
}

function ManagerCard({ manager, projectCount }) {
  const activeProjects = projectCount?.active || 0;
  const totalProjects = projectCount?.total || 0;

  return (
    <li>
      <Link
        href={`/resources/manager/${manager.id}`}
        className="group block rounded-[24px] border border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fff2d1] p-4 shadow-[0_10px_26px_rgba(98,116,142,0.12)] ring-1 ring-white/70 transition active:scale-[0.98] active:border-[#fee39f] active:bg-[#fff7e6]"
      >
        <article aria-labelledby={`manager-${manager.id}-name`}>
          <div className="flex items-start gap-4">
            <Image
              src={avatar}
              alt=""
              className="h-16 w-16 shrink-0 rounded-[22px] border border-white/80 bg-white object-cover p-1 shadow-sm"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a5f12]">
                    Manager
                  </p>
                  <h3
                    id={`manager-${manager.id}-name`}
                    className="mt-1 truncate text-base font-semibold text-gray-950"
                  >
                    {manager.full_name || 'Unnamed manager'}
                  </h3>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/75 text-[#62748e] ring-1 ring-[#fee39f] transition group-active:translate-x-0.5">
                  <ArrowRight size={19} strokeWidth={2.2} />
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                {manager.email && (
                  <p className="flex min-w-0 items-center gap-2 text-sm text-[#717887]">
                    <Mail size={14} className="shrink-0" />
                    <span className="truncate">{manager.email}</span>
                  </p>
                )}

                {manager.phone && (
                  <p className="flex min-w-0 items-center gap-2 text-sm text-[#717887]">
                    <Phone size={14} className="shrink-0" />
                    <span className="truncate">{manager.phone}</span>
                  </p>
                )}

                {manager.created_at && (
                  <p className="flex min-w-0 items-center gap-2 text-sm text-[#717887]">
                    <CalendarDays size={14} className="shrink-0" />
                    <span>Added {formatDateShort(manager.created_at)}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-[18px] border border-white/80 bg-white/70 p-3">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#717887]">
                <BriefcaseBusiness size={14} />
                Active
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-950">
                {activeProjects} projects
              </p>
            </div>

            <div className="rounded-[18px] border border-white/80 bg-white/70 p-3">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#717887]">
                <ShieldCheck size={14} />
                Portfolio
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-950">
                {totalProjects} total
              </p>
            </div>
          </div>
        </article>
      </Link>
    </li>
  );
}

export default function ManagersPage() {
  const [managers, setManagers] = useState([]);
  const [projectCounts, setProjectCounts] = useState(new Map());
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadManagers() {
      setLoading(true);
      setError(null);

      try {
        const { data: managerData, error: managerError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone, address, role, created_at')
          .eq('role', 'manager')
          .order('full_name', { ascending: true });

        if (managerError) throw managerError;

        const managerIds = (managerData || []).map((manager) => manager.id);
        let counts = new Map();

        if (managerIds.length > 0) {
          const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select('id, manager_id, active')
            .in('manager_id', managerIds);

          if (projectError) throw projectError;
          counts = buildProjectCounts(projectData || []);
        }

        setManagers(managerData || []);
        setProjectCounts(counts);
      } catch (err) {
        console.error('Error loading managers:', err);
        setError(err.message || 'Could not load managers.');
        setManagers([]);
        setProjectCounts(new Map());
      } finally {
        setLoading(false);
      }
    }

    loadManagers();
  }, []);

  const filteredManagers = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return managers;

    return managers.filter((manager) =>
      managerMatchesSearch(manager, searchText)
    );
  }, [managers, query]);

  const activeManagerCount = useMemo(
    () =>
      managers.filter(
        (manager) => (projectCounts.get(String(manager.id))?.active || 0) > 0
      ).length,
    [managers, projectCounts]
  );

  return (
    <div className="main-container">
      <section className="mb-4 px-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold leading-tight text-gray-950">
              Manager directory
            </h1>
            <p className="steps-text mt-1.5 max-w-[34rem]">
              Find operational leads, contact details, and active project load.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#62748e] ring-1 ring-[#d5eefc]">
              {managers.length} listed
            </span>
            <span className="rounded-full bg-[#fff8ea] px-3 py-1 text-xs font-semibold text-[#9a5f12] ring-1 ring-[#f6d78c]">
              {activeManagerCount} active
            </span>
          </div>
        </div>
      </section>

      <div className="relative mb-4 mt-3">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#717887]"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search managers, email, phone, or location"
          className="!pl-12"
        />
      </div>

      {loading && <LoadingIndicator />}

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={20} strokeWidth={2.2} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!loading && filteredManagers.length > 0 && (
        <ul className="flex flex-col gap-3">
          {filteredManagers.map((manager) => (
            <ManagerCard
              key={manager.id}
              manager={manager}
              projectCount={projectCounts.get(String(manager.id))}
            />
          ))}
        </ul>
      )}

      {!loading && managers.length > 0 && filteredManagers.length === 0 && (
        <div className="rounded-[24px] border border-dashed border-[#d5eefc] bg-white p-6 text-center">
          <p className="text-sm font-semibold text-gray-900">
            No managers match your search.
          </p>
          <p className="steps-text mt-1">
            Try searching by name, email, phone, or location.
          </p>
        </div>
      )}

      {!loading && managers.length === 0 && !error && (
        <div className="rounded-[24px] border border-dashed border-[#d5eefc] bg-white p-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
            <UserRoundCheck size={24} strokeWidth={2.2} />
          </span>
          <p className="text-sm font-semibold text-gray-900">
            No managers found.
          </p>
          <p className="steps-text mt-1">
            Registered manager profiles will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
