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

const directoryThemes = {
  warm: {
    card:
      'border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fff2d1] active:border-[#fee39f] active:bg-[#fff7e6]',
    kicker: 'text-[#9a5f12]',
    arrowRing: 'ring-[#fee39f]',
    statCard: 'border-[#f6d78c] bg-[#fff8ea]',
    statText: 'text-[#9a5f12]',
  },
  desk: {
    card:
      'border-[#bfdff4] bg-gradient-to-br from-white via-[#f4fbff] to-[#e4f4fb] active:border-[#a7d8ea] active:bg-[#edf9fc]',
    kicker: 'text-[#2b7384]',
    arrowRing: 'ring-[#c7e7f0]',
    statCard: 'border-[#c7e7f0] bg-[#f2fbfd]',
    statText: 'text-[#2b7384]',
  },
  supplier: {
    card:
      'border-[#c9d7cd] bg-gradient-to-br from-white via-[#f6faf7] to-[#e7efe9] active:border-[#aebfb4] active:bg-[#eef5f0]',
    kicker: 'text-[#4f6959]',
    arrowRing: 'ring-[#c9d7cd]',
    statCard: 'border-[#c9d7cd] bg-[#f1f6f2]',
    statText: 'text-[#4f6959]',
  },
  event: {
    card:
      'border-[#edc7f3] bg-gradient-to-br from-white via-[#fff5ff] to-[#fbe3f3] active:border-[#e4aee9] active:bg-[#fff0fb]',
    kicker: 'text-[#9b4ba3]',
    arrowRing: 'ring-[#edc7f3]',
    statCard: 'border-[#edc7f3] bg-[#fff2fb]',
    statText: 'text-[#9b4ba3]',
  },
};

function profileMatchesSearch(profile, searchText) {
  const values = [
    profile.full_name,
    profile.email,
    profile.phone,
    profile.address,
  ];

  return values.some((value) =>
    String(value || '')
      .toLowerCase()
      .includes(searchText)
  );
}

function buildProjectCounts(projects, projectField) {
  return projects.reduce((counts, project) => {
    const profileId = project[projectField];
    if (!profileId) return counts;

    const key = String(profileId);
    const current = counts.get(key) || { total: 0, active: 0 };

    counts.set(key, {
      total: current.total + 1,
      active: current.active + (project.active ? 1 : 0),
    });

    return counts;
  }, new Map());
}

function PartnerCard({
  profile,
  hrefBase,
  singularLabel,
  projectCount,
  projectMetricLabel,
  theme,
}) {
  const activeProjects = projectCount?.active || 0;
  const totalProjects = projectCount?.total || 0;
  const themeClasses = directoryThemes[theme] || directoryThemes.warm;

  return (
    <li>
      <Link
        href={`${hrefBase}/${profile.id}`}
        className={`group block rounded-[24px] border p-4 shadow-[0_10px_26px_rgba(98,116,142,0.12)] ring-1 ring-white/70 transition active:scale-[0.98] ${themeClasses.card}`}
      >
        <article aria-labelledby={`${profile.role}-${profile.id}-name`}>
          <div className="flex items-start gap-4">
            <Image
              src={avatar}
              alt=""
              className="h-16 w-16 shrink-0 rounded-[22px] border border-white/80 bg-white object-cover p-1 shadow-sm"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.16em] ${themeClasses.kicker}`}
                  >
                    {singularLabel}
                  </p>
                  <h3
                    id={`${profile.role}-${profile.id}-name`}
                    className="mt-1 truncate text-base font-semibold text-gray-950"
                  >
                    {profile.full_name || `Unnamed ${singularLabel.toLowerCase()}`}
                  </h3>
                </div>

                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/75 text-[#62748e] ring-1 transition group-active:translate-x-0.5 ${themeClasses.arrowRing}`}
                >
                  <ArrowRight size={19} strokeWidth={2.2} />
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                {profile.email && (
                  <p className="flex min-w-0 items-center gap-2 text-sm text-[#717887]">
                    <Mail size={14} className="shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </p>
                )}

                {profile.phone && (
                  <p className="flex min-w-0 items-center gap-2 text-sm text-[#717887]">
                    <Phone size={14} className="shrink-0" />
                    <span className="truncate">{profile.phone}</span>
                  </p>
                )}

                {profile.created_at && (
                  <p className="flex min-w-0 items-center gap-2 text-sm text-[#717887]">
                    <CalendarDays size={14} className="shrink-0" />
                    <span>Added {formatDateShort(profile.created_at)}</span>
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
                {projectMetricLabel}
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

export default function PartnerDirectoryPage({
  role,
  title,
  singularLabel,
  directoryTitle,
  description,
  searchPlaceholder,
  hrefBase,
  projectField,
  projectMetricLabel = 'Linked',
  theme = 'warm',
}) {
  const [profiles, setProfiles] = useState([]);
  const [projectCounts, setProjectCounts] = useState(new Map());
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProfiles() {
      setLoading(true);
      setError(null);

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone, address, role, created_at')
          .eq('role', role)
          .order('full_name', { ascending: true });

        if (profileError) throw profileError;

        const profileIds = (profileData || []).map((profile) => profile.id);
        let counts = new Map();

        if (profileIds.length > 0 && projectField) {
          const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select(`id, active, ${projectField}`)
            .in(projectField, profileIds);

          if (projectError) throw projectError;
          counts = buildProjectCounts(projectData || [], projectField);
        }

        setProfiles(profileData || []);
        setProjectCounts(counts);
      } catch (err) {
        console.error(`Error loading ${title.toLowerCase()}:`, err);
        setError(err.message || `Could not load ${title.toLowerCase()}.`);
        setProfiles([]);
        setProjectCounts(new Map());
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, [projectField, role, title]);

  const filteredProfiles = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return profiles;

    return profiles.filter((profile) =>
      profileMatchesSearch(profile, searchText)
    );
  }, [profiles, query]);

  const activeProfileCount = useMemo(
    () =>
      profiles.filter(
        (profile) => (projectCounts.get(String(profile.id))?.active || 0) > 0
      ).length,
    [profiles, projectCounts]
  );

  return (
    <div className="main-container">
      <section className="mb-4 px-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold leading-tight text-gray-950">
              {directoryTitle}
            </h1>
            <p className="steps-text mt-1.5 max-w-[34rem]">{description}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#62748e] ring-1 ring-[#d5eefc]">
              {profiles.length} listed
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                (directoryThemes[theme] || directoryThemes.warm).statCard
              } ${(directoryThemes[theme] || directoryThemes.warm).statText}`}
            >
              {activeProfileCount} active
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
          placeholder={searchPlaceholder}
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

      {!loading && filteredProfiles.length > 0 && (
        <ul className="flex flex-col gap-3">
          {filteredProfiles.map((profile) => (
            <PartnerCard
              key={profile.id}
              profile={profile}
              hrefBase={hrefBase}
              singularLabel={singularLabel}
              projectCount={projectCounts.get(String(profile.id))}
              projectMetricLabel={projectMetricLabel}
              theme={theme}
            />
          ))}
        </ul>
      )}

      {!loading && profiles.length > 0 && filteredProfiles.length === 0 && (
        <div className="rounded-[24px] border border-dashed border-[#d5eefc] bg-white p-6 text-center">
          <p className="text-sm font-semibold text-gray-900">
            No {title.toLowerCase()} match your search.
          </p>
          <p className="steps-text mt-1">
            Try searching by name, email, phone, or location.
          </p>
        </div>
      )}

      {!loading && profiles.length === 0 && !error && (
        <div className="rounded-[24px] border border-dashed border-[#d5eefc] bg-white p-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
            <UserRoundCheck size={24} strokeWidth={2.2} />
          </span>
          <p className="text-sm font-semibold text-gray-900">
            No {title.toLowerCase()} found.
          </p>
          <p className="steps-text mt-1">
            Registered {title.toLowerCase()} profiles will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
