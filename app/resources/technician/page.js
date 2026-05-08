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

function technicianMatchesSearch(technician, searchText) {
  const values = [
    technician.full_name,
    technician.email,
    technician.phone,
    technician.address,
  ];

  return values.some((value) =>
    String(value || '')
      .toLowerCase()
      .includes(searchText)
  );
}

function buildProjectCounts(assignments) {
  return assignments.reduce((counts, assignment) => {
    if (!assignment.profiles_id) return counts;

    const technicianId = String(assignment.profiles_id);
    const current = counts.get(technicianId) || { total: 0, active: 0 };
    const project = assignment.projects;

    counts.set(technicianId, {
      total: current.total + 1,
      active: current.active + (project?.active ? 1 : 0),
    });

    return counts;
  }, new Map());
}

function TechnicianCard({ technician, projectCount }) {
  const activeProjects = projectCount?.active || 0;
  const totalProjects = projectCount?.total || 0;

  return (
    <li>
      <Link
        href={`/resources/technician/${technician.id}`}
        className="group block rounded-[24px] border border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fff2d1] p-4 shadow-[0_10px_26px_rgba(98,116,142,0.12)] ring-1 ring-white/70 transition active:scale-[0.98] active:border-[#fee39f] active:bg-[#fff7e6]"
      >
        <article aria-labelledby={`technician-${technician.id}-name`}>
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
                    Technician
                  </p>
                  <h3
                    id={`technician-${technician.id}-name`}
                    className="mt-1 truncate text-base font-semibold text-gray-950"
                  >
                    {technician.full_name || 'Unnamed technician'}
                  </h3>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/75 text-[#62748e] ring-1 ring-[#fee39f] transition group-active:translate-x-0.5">
                  <ArrowRight size={19} strokeWidth={2.2} />
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                {technician.email && (
                  <p className="flex min-w-0 items-center gap-2 text-sm text-[#717887]">
                    <Mail size={14} className="shrink-0" />
                    <span className="truncate">{technician.email}</span>
                  </p>
                )}

                {technician.phone && (
                  <p className="flex min-w-0 items-center gap-2 text-sm text-[#717887]">
                    <Phone size={14} className="shrink-0" />
                    <span className="truncate">{technician.phone}</span>
                  </p>
                )}

                {technician.created_at && (
                  <p className="flex min-w-0 items-center gap-2 text-sm text-[#717887]">
                    <CalendarDays size={14} className="shrink-0" />
                    <span>Added {formatDateShort(technician.created_at)}</span>
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
                Assigned
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

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState([]);
  const [projectCounts, setProjectCounts] = useState(new Map());
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTechnicians() {
      setLoading(true);
      setError(null);

      try {
        const { data: technicianData, error: technicianError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone, address, role, created_at')
          .eq('role', 'technician')
          .order('full_name', { ascending: true });

        if (technicianError) throw technicianError;

        const technicianIds = (technicianData || []).map(
          (technician) => technician.id
        );
        let counts = new Map();

        if (technicianIds.length > 0) {
          const { data: assignmentData, error: assignmentError } =
            await supabase
              .from('profiles_projects')
              .select(
                `
                  profiles_id,
                  projects:projects_id (
                    id,
                    active
                  )
                `
              )
              .in('profiles_id', technicianIds);

          if (assignmentError) throw assignmentError;
          counts = buildProjectCounts(assignmentData || []);
        }

        setTechnicians(technicianData || []);
        setProjectCounts(counts);
      } catch (err) {
        console.error('Error loading technicians:', err);
        setError(err.message || 'Could not load technicians.');
        setTechnicians([]);
        setProjectCounts(new Map());
      } finally {
        setLoading(false);
      }
    }

    loadTechnicians();
  }, []);

  const filteredTechnicians = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return technicians;

    return technicians.filter((technician) =>
      technicianMatchesSearch(technician, searchText)
    );
  }, [technicians, query]);

  const activeTechnicianCount = useMemo(
    () =>
      technicians.filter(
        (technician) => (projectCounts.get(String(technician.id))?.active || 0) > 0
      ).length,
    [technicians, projectCounts]
  );

  return (
    <div className="main-container">
      <div className="form-header">
        <h1 className="ml-2">Technicians</h1>
      </div>

      <section className="mb-4 px-1">
        <p className="page-kicker">People & partners</p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2>Technician directory</h2>
            <p className="steps-text mt-1">
              Find field users, contact details, and assigned project load.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#62748e] ring-1 ring-[#d5eefc]">
            {technicians.length}
          </span>
        </div>
      </section>

      <section className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-[22px] border border-[#d5eefc] bg-white p-3 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#717887]">
            <UserRoundCheck size={15} />
            Listed
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-950">
            {technicians.length}
          </p>
        </div>

        <div className="rounded-[22px] border border-[#f6d78c] bg-[#fff8ea] p-3 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#9a5f12]">
            <BriefcaseBusiness size={15} />
            Active
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-950">
            {activeTechnicianCount}
          </p>
        </div>
      </section>

      <div className="relative mb-4">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#717887]"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search technicians, email, phone, or location"
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

      {!loading && filteredTechnicians.length > 0 && (
        <ul className="flex flex-col gap-3">
          {filteredTechnicians.map((technician) => (
            <TechnicianCard
              key={technician.id}
              technician={technician}
              projectCount={projectCounts.get(String(technician.id))}
            />
          ))}
        </ul>
      )}

      {!loading && technicians.length > 0 && filteredTechnicians.length === 0 && (
        <div className="rounded-[24px] border border-dashed border-[#d5eefc] bg-white p-6 text-center">
          <p className="text-sm font-semibold text-gray-900">
            No technicians match your search.
          </p>
          <p className="steps-text mt-1">
            Try searching by name, email, phone, or location.
          </p>
        </div>
      )}

      {!loading && technicians.length === 0 && !error && (
        <div className="rounded-[24px] border border-dashed border-[#d5eefc] bg-white p-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
            <UserRoundCheck size={24} strokeWidth={2.2} />
          </span>
          <p className="text-sm font-semibold text-gray-900">
            No technicians found.
          </p>
          <p className="steps-text mt-1">
            Registered technician profiles will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
