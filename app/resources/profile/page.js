'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  Fuel,
  Gauge,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';
import avatar from '@/public/avatar.png';
import LoadingIndicator from '@/components/LoadingIndicator';
import formatDate from '@/components/FormatDate';
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

const TRANSACTION_SELECT = `
  id,
  type,
  status,
  created_at,
  completed_at,
  project_id,
  generator_id,
  before_fuel_level,
  after_fuel_level,
  after_photo_url,
  projects (
    id,
    name
  ),
  generators (
    id,
    name
  )
`;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function shortRole(role) {
  return String(role || 'team member')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getMovement(transaction) {
  const before = toNumber(transaction.before_fuel_level);
  const after = toNumber(transaction.after_fuel_level);

  if (!transaction.after_fuel_level) return 'Pending';

  const prefix = transaction.type === 'delivery' ? '+' : '-';
  return `${prefix}${Math.abs(after - before).toFixed(0)} L`;
}

function MetricCard({ icon: Icon, label, value, hint, tone = 'slate' }) {
  const tones = {
    orange: 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]',
    green: 'bg-[#f3fbef] text-[#2f8f5b] ring-[#d7edce]',
    slate: 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]',
    amber: 'bg-[#fff7e6] text-[#9a5f12] ring-[#fee39f]',
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

function TransactionCard({ transaction }) {
  const hasAfterEvidence =
    Boolean(transaction.after_photo_url) && transaction.after_fuel_level;

  return (
    <Link
      href={`/resources/projects/${transaction.project_id}/transactions/${transaction.id}`}
      className="block rounded-[22px] border border-[#e8edf3] bg-white/85 p-4 shadow-[0_4px_12px_rgba(98,116,142,0.06)] transition active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--primary-black)]">
            {transaction.type === 'return' ? 'Fuel return' : 'Fuel delivery'}
          </p>
          <p className="steps-text mt-1 truncate">
            {transaction.projects?.name || 'Unassigned project'}
          </p>
          <p className="steps-text mt-1 truncate">
            {transaction.generators?.name || 'Unassigned generator'}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-[var(--primary-black)]">
            {getMovement(transaction)}
          </p>
          <p
            className={`mt-1 text-xs font-semibold ${
              hasAfterEvidence ? 'text-[#2f8f5b]' : 'text-[#9a5f12]'
            }`}
          >
            {hasAfterEvidence ? 'Complete' : 'Needs after'}
          </p>
        </div>
      </div>

      <p className="steps-text mt-3 flex items-center gap-2">
        <Clock size={15} strokeWidth={2.2} />
        {formatDate(transaction.created_at)}
      </p>
    </Link>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const loadProfileDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/signIn');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, role, address')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileData) {
        setErrorMessage('No profile found for this user.');
        return;
      }

      const [relationResult, managedResult, supplierResult, organizerResult] =
        await Promise.all([
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
          supabase
            .from('projects')
            .select(PROJECT_SELECT)
            .eq('manager_id', profileData.id),
          supabase
            .from('projects')
            .select(PROJECT_SELECT)
            .eq('fuel_suppliers_id', profileData.id),
          supabase
            .from('projects')
            .select(PROJECT_SELECT)
            .eq('event_organizer_id', profileData.id),
        ]);

      const projectErrors = [
        relationResult.error,
        managedResult.error,
        supplierResult.error,
        organizerResult.error,
      ].filter(Boolean);

      if (projectErrors.length > 0) throw projectErrors[0];

      const projectMap = new Map();
      const relationProjects =
        relationResult.data?.map((item) => item.projects).filter(Boolean) || [];

      for (const project of [
        ...relationProjects,
        ...(managedResult.data || []),
        ...(supplierResult.data || []),
        ...(organizerResult.data || []),
      ]) {
        projectMap.set(String(project.id), project);
      }

      let transactionData = [];

      if (profileData.role === 'technician') {
        const { data, error } = await supabase
          .from('fuel_transactions')
          .select(TRANSACTION_SELECT)
          .eq('technician_id', profileData.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        transactionData = data || [];
      }

      setProfile(profileData);
      setAssignedProjects(Array.from(projectMap.values()));
      setTransactions(transactionData);
    } catch (error) {
      console.error('Error loading profile dashboard:', error);
      setErrorMessage(error.message || 'Could not load profile.');
      setProfile(null);
      setAssignedProjects([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(loadProfileDashboard, 0);

    return () => window.clearTimeout(timer);
  }, [loadProfileDashboard]);

  const summary = useMemo(() => {
    const pending = transactions.filter(
      (transaction) => !transaction.after_photo_url || !transaction.after_fuel_level
    ).length;

    return {
      activeProjects: assignedProjects.filter((project) => project.active)
        .length,
      completedTransactions: transactions.length - pending,
      pendingTransactions: pending,
    };
  }, [assignedProjects, transactions]);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error logging out:', error.message);
      setLoggingOut(false);
      return;
    }

    router.replace('/');
  };

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

  return (
    <div className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Profile</p>
      </div>

      <section className="relative mb-4 overflow-hidden rounded-[28px] border border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fee39f] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/45" />
        <div className="pointer-events-none absolute -bottom-24 left-8 h-44 w-44 rounded-full bg-[#ff8a00]/10" />

        <div className="relative flex items-start gap-4">
          <Image
            src={avatar}
            alt=""
            className="h-20 w-20 shrink-0 rounded-[24px] border border-white/80 bg-white object-cover p-1 shadow-sm"
          />

          <div className="min-w-0 flex-1">
            <p className="steps-text uppercase tracking-[0.18em]">
              {shortRole(profile?.role)}
            </p>
            <h2 className="mt-2 truncate">
              {profile?.full_name || 'Unnamed profile'}
            </h2>
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
              {assignedProjects.length} assigned
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

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="relative mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/75 px-4 text-sm font-semibold text-[#41516a] shadow-sm transition active:scale-[0.98] disabled:opacity-50"
        >
          <LogOut size={18} strokeWidth={2.2} />
          {loggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </section>

      <section className="background-container mb-4">
        <SectionHeader
          eyebrow="Overview"
          title="Work snapshot"
          description="Current assignment and fuel evidence activity."
        />
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={BriefcaseBusiness}
            label="Assigned"
            value={assignedProjects.length}
            hint="Projects linked to this profile"
            tone="orange"
          />
          <MetricCard
            icon={UsersRound}
            label="Role"
            value={shortRole(profile?.role)}
          />
          {profile?.role === 'technician' && (
            <>
              <MetricCard
                icon={CheckCircle2}
                label="Complete"
                value={summary.completedTransactions}
                hint="Recent transaction evidence"
                tone="green"
              />
              <MetricCard
                icon={Clock}
                label="Needs after"
                value={summary.pendingTransactions}
                hint="Recent transaction evidence"
                tone={summary.pendingTransactions > 0 ? 'amber' : 'green'}
              />
            </>
          )}
        </div>
      </section>

      <section className="background-container-white mb-4">
        <SectionHeader
          eyebrow="Contact"
          title="Profile details"
          description="Fast access to the contact information used by the operations team."
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
          <ContactRow
            icon={UserRound}
            label="Profile ID"
            value={profile?.id}
          />
        </div>
      </section>

      <section className="background-container-white mb-4">
        <SectionHeader
          eyebrow="Assignments"
          title="Assigned projects"
          description="Projects connected to this profile through role or technician assignment."
        />

        {assignedProjects.length === 0 ? (
          <EmptyCard
            title="No assigned projects"
            description="Projects linked to this profile will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {assignedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {profile?.role === 'technician' && (
        <section className="background-container-white mb-4">
          <SectionHeader
            eyebrow="Fuel evidence"
            title="Latest transactions"
            description="The most recent fuel movements captured by this technician."
          />

          {transactions.length === 0 ? (
            <EmptyCard
              title="No fuel transactions yet"
              description="Once this technician records fuel evidence, the latest activity will appear here."
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <Link
        href="/resources/projects"
        className="form-button mb-4 w-full justify-center gap-2"
      >
        <Fuel size={18} />
        Open projects
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
