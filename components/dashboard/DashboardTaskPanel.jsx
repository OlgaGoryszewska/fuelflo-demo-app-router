'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Send,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const TASK_SELECT = `
  id,
  title,
  description,
  priority,
  status,
  due_date,
  assigned_to,
  created_by,
  created_at
`;

const roleAssigneeMap = {
  hire_desk: ['manager', 'technician'],
  manager: ['technician'],
};

const priorityOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'low', label: 'Low' },
];

function formatProfileName(profileId, profilesById) {
  const profile = profilesById.get(String(profileId));

  if (!profile) return 'Unassigned';

  return profile.full_name || profile.email || 'Unnamed user';
}

function formatRole(role) {
  return String(role || 'team member').replaceAll('_', ' ');
}

function isMissingTableError(error) {
  return (
    error?.code === '42P01' ||
    error?.message?.toLowerCase().includes('dashboard_tasks')
  );
}

export default function DashboardTaskPanel({ role }) {
  const [profile, setProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [setupRequired, setSetupRequired] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'normal',
    due_date: '',
  });

  const assignableRoles = useMemo(() => roleAssigneeMap[role] || [], [role]);
  const canCreateTask = assignableRoles.length > 0;

  const profilesById = useMemo(() => {
    return new Map(profiles.map((item) => [String(item.id), item]));
  }, [profiles]);

  const visibleTasks = useMemo(() => {
    return tasks.slice(0, 6);
  }, [tasks]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    setMessage('');
    setSetupRequired(false);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        setProfile(null);
        setTasks([]);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      setProfile(profileData);

      const profileQueryRoles = Array.from(
        new Set([...assignableRoles, 'manager', 'technician'])
      );
      const { data: profileRows, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', profileQueryRoles)
        .order('full_name', { ascending: true });

      if (profilesError) throw profilesError;

      setProfiles(profileRows || []);

      const { data: taskRows, error: tasksError } = await supabase
        .from('dashboard_tasks')
        .select(TASK_SELECT)
        .or(`assigned_to.eq.${user.id},created_by.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (tasksError) {
        if (isMissingTableError(tasksError)) {
          setSetupRequired(true);
          setTasks([]);
          return;
        }

        throw tasksError;
      }

      setTasks(taskRows || []);
    } catch (caughtError) {
      console.error('Error loading dashboard tasks:', caughtError);
      setError(caughtError.message || 'Could not load dashboard tasks.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [assignableRoles]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadTasks, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadTasks]);

  async function handleCreateTask(event) {
    event.preventDefault();
    if (!profile?.id || saving || !canCreateTask) return;

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title || !form.assigned_to) {
      setMessage('Add a task title and choose who should receive it.');
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const { data, error: insertError } = await supabase
        .from('dashboard_tasks')
        .insert([
          {
            title,
            description: description || null,
            assigned_to: form.assigned_to,
            created_by: profile.id,
            priority: form.priority,
            due_date: form.due_date || null,
            status: 'open',
          },
        ])
        .select(TASK_SELECT)
        .single();

      if (insertError) {
        if (isMissingTableError(insertError)) {
          setSetupRequired(true);
          return;
        }

        throw insertError;
      }

      setTasks((current) => [data, ...current]);
      setForm({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'normal',
        due_date: '',
      });
      setMessage('Task sent to dashboard.');
    } catch (caughtError) {
      console.error('Error creating dashboard task:', caughtError);
      setError(caughtError.message || 'Could not create task.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCompleteTask(taskId) {
    setError('');
    setMessage('');

    const previousTasks = tasks;
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status: 'done' } : task
      )
    );

    const { error: updateError } = await supabase
      .from('dashboard_tasks')
      .update({ status: 'done' })
      .eq('id', taskId);

    if (updateError) {
      setTasks(previousTasks);
      setError(updateError.message || 'Could not complete task.');
    }
  }

  return (
    <section className="rounded-2xl border border-[#e8edf3] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="page-kicker">Tasks</p>
          <h3 className="mt-1 text-lg font-semibold text-gray-950">
            Team task list
          </h3>
          <p className="mt-1 text-sm leading-5 text-[#62748e]">
            Send dashboard tasks to managers or technicians and track what lands
            on your own list.
          </p>
        </div>
        <ClipboardList className="h-5 w-5 shrink-0 text-[#62748e]" />
      </div>

      {setupRequired && (
        <div className="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-900">
          Create a Supabase table named <strong>dashboard_tasks</strong> to turn
          on team tasks.
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-2xl border border-[#d5eefc] bg-[#f5fbff] p-3 text-sm text-[#41516a]">
          {message}
        </div>
      )}

      {canCreateTask && !setupRequired && (
        <form
          onSubmit={handleCreateTask}
          className="mb-4 rounded-2xl border border-[#e8edf3] bg-[#fbfdff] p-3 shadow-none"
        >
          <div className="grid gap-3">
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Task title"
              maxLength={90}
            />

            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Details or context"
              rows={3}
              className="w-full rounded-xl border border-[var(--primary-gray-light)] bg-white p-3 text-sm text-[#62748e]"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <select
                value={form.assigned_to}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    assigned_to: event.target.value,
                  }))
                }
              >
                <option value="">Send to</option>
                {profiles
                  .filter((item) => assignableRoles.includes(item.role))
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.full_name || item.email} - {formatRole(item.role)}
                    </option>
                  ))}
              </select>

              <select
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    priority: event.target.value,
                  }))
                }
              >
                {priorityOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={form.due_date}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    due_date: event.target.value,
                  }))
                }
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#f25822] bg-[#f25822] px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={17} strokeWidth={2.3} />
              {saving ? 'Sending task...' : 'Send task'}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-2">
        {loading && (
          <div className="rounded-2xl border border-[#e8edf3] bg-[#fbfdff] p-3 text-sm text-[#62748e]">
            Loading tasks...
          </div>
        )}

        {!loading && !setupRequired && visibleTasks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#d5eefc] bg-[#fbfdff] p-4 text-sm text-[#62748e]">
            No dashboard tasks yet.
          </div>
        )}

        {!loading &&
          !setupRequired &&
          visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              profile={profile}
              profilesById={profilesById}
              onComplete={handleCompleteTask}
            />
          ))}
      </div>
    </section>
  );
}

function TaskCard({ task, profile, profilesById, onComplete }) {
  const isAssignedToMe = String(task.assigned_to) === String(profile?.id);
  const isDone = task.status === 'done';

  return (
    <article
      className={`rounded-2xl border p-3 ${
        isDone
          ? 'border-green-100 bg-green-50'
          : task.priority === 'urgent'
            ? 'border-yellow-200 bg-yellow-50'
            : 'border-[#e8edf3] bg-[#fbfdff]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#62748e] ring-1 ring-[#d5eefc]">
              {task.priority || 'normal'}
            </span>
            <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-[#62748e] ring-1 ring-[#d5eefc]">
              {isAssignedToMe ? 'Assigned to you' : 'Sent by you'}
            </span>
          </div>

          <p className="text-sm font-semibold text-gray-950">{task.title}</p>
          {task.description && (
            <p className="mt-1 text-sm leading-5 text-[#62748e]">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#717887]">
            <span>
              To {formatProfileName(task.assigned_to, profilesById)}
            </span>
            <span>
              From {formatProfileName(task.created_by, profilesById)}
            </span>
            {task.due_date && (
              <span className="inline-flex items-center gap-1">
                <Clock3 size={13} />
                Due {task.due_date}
              </span>
            )}
          </div>
        </div>

        {isAssignedToMe && !isDone && (
          <button
            type="button"
            onClick={() => onComplete(task.id)}
            aria-label={`Complete ${task.title}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-green-700 ring-1 ring-green-100 transition active:scale-95"
          >
            <CheckCircle2 size={18} strokeWidth={2.3} />
          </button>
        )}
      </div>
    </article>
  );
}
