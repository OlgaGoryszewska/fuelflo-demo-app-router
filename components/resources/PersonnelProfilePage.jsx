'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import avatar from '@/public/avatar.png';
import LoadingIndicator from '@/components/LoadingIndicator';
import formatDateShort from '@/components/FormatDateShort';
import { supabase } from '@/lib/supabaseClient';

const PROJECT_SELECT = `
  id,
  name,
  location,
  start_date,
  end_date,
  active,
  manager_id,
  fuel_suppliers_id,
  event_organizer_id
`;

function shortRole(role) {
  return String(role || 'team member')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function MetricCard({ icon: Icon, label, value, hint, tone = 'slate' }) {
  const tones = {
    orange: 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]',
    green: 'bg-[#f3fbef] text-[#2f8f5b] ring-[#d7edce]',
    slate: 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]',
    amber: 'bg-[#fff7e6] text-[#9a5f12] ring-[#fee39f]',
    desk: 'bg-[#f2fbfd] text-[#2b7384] ring-[#c7e7f0]',
    supplier: 'bg-[#f3fbef] text-[#2f7d57] ring-[#c8e6d5]',
    event: 'bg-[#fff6f0] text-[#b6532f] ring-[#ffd0ba]',
  };

  return (
    <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4 shadow-[0_4px_12px_rgba(98,116,142,0.06)]">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ring-1 ${tones[tone]}`}
      >
        <Icon size={20} strokeWidth={2.3} />
      </div>
      <p className="text-xl font-semibold text-[var(--primary-black)]">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#62748e]">{label}</p>
      {hint && <p className="steps-text mt-1">{hint}</p>}
    </div>
  );
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-4">
      {eyebrow && <p className="page-kicker">{eyebrow}</p>}
      <h2 className="mt-1">{title}</h2>
      {description && <p className="steps-text mt-1">{description}</p>}
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href }) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
        <Icon size={18} strokeWidth={2.2} />
      </span>
      <span className="min-w-0">
        <span className="steps-text block">{label}</span>
        <span className="block truncate text-sm font-semibold text-[var(--primary-black)]">
          {value || 'Missing'}
        </span>
      </span>
    </>
  );

  if (href && value) {
    return (
      <Link href={href} className="flex items-center gap-3 py-2">
        {content}
      </Link>
    );
  }

  return <div className="flex items-center gap-3 py-2">{content}</div>;
}

function EmptyCard({ title, description }) {
  return (
    <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4">
      <p className="text-sm font-semibold text-[var(--primary-black)]">
        {title}
      </p>
      <p className="steps-text mt-1">{description}</p>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <Link
      href={`/resources/projects/${project.id}`}
      className="block rounded-[22px] border border-[#e8edf3] bg-white/85 p-4 shadow-[0_4px_12px_rgba(98,116,142,0.06)] transition active:scale-[0.98]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--primary-black)]">
            {project.name || 'Unnamed project'}
          </p>
          <p className="steps-text mt-1">
            {project.active ? 'Active project' : 'Inactive project'}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
            project.active
              ? 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]'
              : 'border-[#e8edf3] bg-white text-[#717887]'
          }`}
        >
          {project.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <p className="steps-text flex items-center gap-2">
          <MapPin size={15} strokeWidth={2.2} />
          <span className="truncate">{project.location || 'No location'}</span>
        </p>
        <p className="steps-text flex items-center gap-2">
          <CalendarDays size={15} strokeWidth={2.2} />
          <span>
            {formatDateShort(project.start_date)} -{' '}
            {formatDateShort(project.end_date)}
          </span>
        </p>
      </div>
    </Link>
  );
}

function getBackHref(role) {
  if (role === 'manager') return '/resources/manager';
  if (role === 'technician') return '/resources/technician';
  if (role === 'hire_desk') return '/resources/hire-desk';
  if (role === 'fuel_supplier') return '/resources/fuel_suppliers';
  if (role === 'event_organizer') return '/resources/event_organizers';

  return '/resources/projects';
}

function getProjectOwnerField(role) {
  if (role === 'manager') return 'manager_id';
  if (role === 'fuel_supplier') return 'fuel_suppliers_id';
  if (role === 'event_organizer') return 'event_organizer_id';

  return null;
}

function getAssignmentTitle(role) {
  if (role === 'manager') return 'Managed projects';
  if (role === 'fuel_supplier') return 'Supplied projects';
  if (role === 'event_organizer') return 'Event projects';

  return 'Assigned projects';
}

function getAssignmentDescription(role) {
  if (role === 'manager') {
    return 'Projects where this manager is the operational lead.';
  }

  if (role === 'fuel_supplier') {
    return 'Projects where this supplier is the fuel partner.';
  }

  if (role === 'event_organizer') {
    return 'Projects connected to this event organizer.';
  }

  return 'Projects connected to this profile through assignment.';
}

function getEmptyProjectTitle(role) {
  if (role === 'manager') return 'No managed projects';
  if (role === 'fuel_supplier') return 'No supplied projects';
  if (role === 'event_organizer') return 'No event projects';

  return 'No assigned projects';
}

function getProfileTheme(role) {
  if (role === 'hire_desk') {
    return {
      hero:
        'border-[#bfdff4] bg-gradient-to-br from-white via-[#f4fbff] to-[#d7edf6]',
      accent: 'bg-[#2b7384]/10',
      statIconTone: 'desk',
    };
  }

  if (role === 'fuel_supplier') {
    return {
      hero:
        'border-[#c8e6d5] bg-gradient-to-br from-white via-[#f5fcf7] to-[#dff2e7]',
      accent: 'bg-[#2f7d57]/10',
      statIconTone: 'supplier',
    };
  }

  if (role === 'event_organizer') {
    return {
      hero:
        'border-[#ffd0ba] bg-gradient-to-br from-white via-[#fff8f4] to-[#ffe3d5]',
      accent: 'bg-[#f25822]/10',
      statIconTone: 'event',
    };
  }

  return {
    hero:
      'border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fee39f]',
    accent: 'bg-[#ff8a00]/10',
    statIconTone: 'orange',
  };
}

export default function PersonnelProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    async function loadProfile() {
      setLoading(true);
      setErrorMessage('');

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, full_name, phone, role, address, created_at')
          .eq('id', id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profileData) {
          setProfile(null);
          setProjects([]);
          setErrorMessage('Personnel profile not found.');
          return;
        }

        const queries = [
          supabase
            .from('profiles_projects')
            .select(
              `
                projects_id,
                projects:projects_id (
                  ${PROJECT_SELECT}
                )
              `
            )
            .eq('profiles_id', profileData.id),
        ];

        const projectOwnerField = getProjectOwnerField(profileData.role);

        if (projectOwnerField) {
          queries.push(
            supabase
              .from('projects')
              .select(PROJECT_SELECT)
              .eq(projectOwnerField, profileData.id)
          );
        }

        const results = await Promise.all(queries);
        const firstError = results.map((result) => result.error).find(Boolean);

        if (firstError) throw firstError;

        const projectMap = new Map();
        const relationProjects =
          results[0].data?.map((item) => item.projects).filter(Boolean) || [];

        for (const project of relationProjects) {
          projectMap.set(String(project.id), project);
        }

        if (projectOwnerField) {
          for (const project of results[1].data || []) {
            projectMap.set(String(project.id), project);
          }
        }

        setProfile(profileData);
        setProjects(Array.from(projectMap.values()));
      } catch (error) {
        console.error('Error loading personnel profile:', error);
        setErrorMessage(error.message || 'Could not load profile.');
        setProfile(null);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

  const summary = useMemo(
    () => ({
      activeProjects: projects.filter((project) => project.active).length,
      inactiveProjects: projects.filter((project) => !project.active).length,
    }),
    [projects]
  );

  if (loading) return <LoadingIndicator />;

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-3 py-4">
        <div className="rounded-[24px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
          {errorMessage}
        </div>
      </div>
    );
  }

  const roleLabel = shortRole(profile?.role);
  const backHref = getBackHref(profile?.role);
  const profileTheme = getProfileTheme(profile?.role);

  return (
    <div className="mx-auto w-full max-w-[640px] px-3 py-4">
      <Link
        href={backHref}
        className="mb-3 inline-flex h-10 items-center gap-2 rounded-full border border-[#d5eefc] bg-white px-3 text-sm font-semibold text-[#62748e] shadow-sm transition active:scale-[0.98]"
      >
        <ArrowLeft size={16} strokeWidth={2.3} />
        Back
      </Link>

      <section
        className={`relative mb-4 overflow-hidden rounded-[28px] border p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)] ${profileTheme.hero}`}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/45" />
        <div
          className={`pointer-events-none absolute -bottom-24 left-8 h-44 w-44 rounded-full ${profileTheme.accent}`}
        />

        <div className="relative flex items-start gap-4">
          <Image
            src={avatar}
            alt=""
            className="h-20 w-20 shrink-0 rounded-[24px] border border-white/80 bg-white object-cover p-1 shadow-sm"
          />

          <div className="min-w-0 flex-1">
            <p className="steps-text uppercase tracking-[0.18em]">
              {roleLabel}
            </p>
            <h1 className="mt-2 truncate text-2xl font-semibold text-[var(--primary-black)]">
              {profile?.full_name || 'Unnamed profile'}
            </h1>
            <p className="steps-text mt-1 truncate">{profile?.email}</p>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[20px] border border-white/70 bg-white/70 p-3">
            <p className="steps-text flex items-center gap-2">
              <BriefcaseBusiness size={16} />
              Projects
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--primary-black)]">
              {projects.length} linked
            </p>
          </div>
          <div className="rounded-[20px] border border-white/70 bg-white/70 p-3">
            <p className="steps-text flex items-center gap-2">
              <ShieldCheck size={16} />
              Active
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--primary-black)]">
              {summary.activeProjects} current
            </p>
          </div>
        </div>
      </section>

      <section className="background-container mb-4">
        <SectionHeader
          eyebrow="Overview"
          title="Work snapshot"
          description="Project visibility and operational responsibility for this profile."
        />
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={BriefcaseBusiness}
            label="Linked"
            value={projects.length}
            hint="Projects connected to this profile"
            tone={profileTheme.statIconTone}
          />
          <MetricCard
            icon={ShieldCheck}
            label="Active"
            value={summary.activeProjects}
            hint="Current active projects"
            tone={summary.activeProjects > 0 ? 'green' : 'slate'}
          />
        </div>
      </section>

      <section className="background-container-white mb-4">
        <SectionHeader
          eyebrow="Contact"
          title="Profile details"
          description="Fast access to contact information used by the operations team."
        />
        <div className="divide-y divide-[#edf1f5]">
          <ContactRow
            icon={Phone}
            label="Phone"
            value={profile?.phone}
            href={`tel:${profile?.phone}`}
          />
          <ContactRow
            icon={Mail}
            label="Email"
            value={profile?.email}
            href={`mailto:${profile?.email}`}
          />
          <ContactRow icon={MapPin} label="Address" value={profile?.address} />
          <ContactRow icon={UserRound} label="Profile ID" value={profile?.id} />
          <ContactRow
            icon={CalendarDays}
            label="Added"
            value={formatDateShort(profile?.created_at)}
          />
        </div>
      </section>

      <section className="background-container-white mb-4">
        <SectionHeader
          eyebrow="Assignments"
          title={getAssignmentTitle(profile?.role)}
          description={getAssignmentDescription(profile?.role)}
        />

        {projects.length === 0 ? (
          <EmptyCard
            title={getEmptyProjectTitle(profile?.role)}
            description="Linked projects will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <Link
        href="/resources/projects"
        className="form-button mb-4 w-full justify-center gap-2"
      >
        Open projects
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
