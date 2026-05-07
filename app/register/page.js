'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  UserRound,
  UsersRound,
  Wrench,
} from 'lucide-react';

const ROLE_OPTIONS = [
  {
    value: 'technician',
    label: 'Technician',
    description: 'Field fuel transactions and evidence capture.',
    icon: Wrench,
  },
  {
    value: 'manager',
    label: 'Manager',
    description: 'Project oversight, team coordination, and reports.',
    icon: ShieldCheck,
  },
  {
    value: 'hire_desk',
    label: 'Hire desk',
    description: 'Create projects, users, equipment, and operational setup.',
    icon: BriefcaseBusiness,
  },
  {
    value: 'event_organizer',
    label: 'Event organizer',
    description: 'Customer or organizer contact for event fuel delivery.',
    icon: UsersRound,
  },
  {
    value: 'fuel_supplier',
    label: 'Fuel supplier',
    description: 'Supplier contact connected to project fuel delivery.',
    icon: Truck,
  },
];

const DEFAULT_FORM = {
  full_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'technician',
  address: '',
  phone: '',
};

function trimValue(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function validateUserForm(formData) {
  const errors = {};
  const fullName = trimValue(formData.full_name);
  const email = trimValue(formData.email);
  const phone = trimValue(formData.phone);
  const address = trimValue(formData.address);
  const selectedRole = ROLE_OPTIONS.some(
    (role) => role.value === formData.role
  );

  if (!fullName) errors.full_name = 'Full name is required.';
  if (!phone) errors.phone = 'Phone number is required.';
  if (!address) errors.address = 'Address is required.';
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!formData.password) {
    errors.password = 'Temporary password is required.';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Confirm the temporary password.';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (!selectedRole) errors.role = 'Select a valid role.';

  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-[#b7791f]">{message}</p>;
}

function RoleCard({ option, selected, onSelect }) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`flex w-full items-start gap-3 rounded-[22px] border p-4 text-left transition active:scale-[0.98] ${
        selected
          ? 'border-[#fee39f] bg-[#fff7e6] ring-1 ring-[#fee39f]'
          : 'border-[#e8edf3] bg-white/85 active:bg-[#eef4fb]'
      }`}
      aria-pressed={selected}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${
          selected
            ? 'bg-white text-[#f25822] ring-[#fee39f]'
            : 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]'
        }`}
      >
        <Icon size={20} strokeWidth={2.3} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[var(--primary-black)]">
          {option.label}
        </span>
        <span className="steps-text mt-1 block">{option.description}</span>
      </span>
    </button>
  );
}

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  }

  function handleRoleSelect(role) {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
    setErrors((current) => ({
      ...current,
      role: undefined,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback({ type: '', message: '' });

    const nextErrors = validateUserForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback({
        type: 'warning',
        message: 'Please fix the highlighted fields before creating the user.',
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: trimValue(formData.full_name),
          email: trimValue(formData.email),
          password: formData.password,
          role: formData.role,
          address: trimValue(formData.address),
          phone: trimValue(formData.phone),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Could not create user.');
      }

      setFeedback({
        type: 'success',
        message: 'User and profile created successfully.',
      });
      setFormData(DEFAULT_FORM);
      setErrors({});

      setTimeout(() => {
        router.push('/operations/dashboard/hire-desk');
      }, 1000);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const selectedRole = ROLE_OPTIONS.find(
    (role) => role.value === formData.role
  );

  return (
    <div className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">User management</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="background-container">
          <section className="relative mb-4 overflow-hidden rounded-[28px] border border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fee39f] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/45" />
            <div className="relative flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#f25822] ring-1 ring-[#fee39f]">
                <UserRound size={24} strokeWidth={2.4} />
              </span>
              <div>
                <p className="steps-text uppercase tracking-[0.18em]">
                  Create account
                </p>
                <h2 className="mt-1">Add new user</h2>
                <p className="steps-text mt-1">
                  Create a secure profile and assign the right operational role.
                </p>
              </div>
            </div>
          </section>

          {feedback.message && (
            <div
              className={`mb-4 rounded-[22px] border p-4 text-sm ${
                feedback.type === 'success'
                  ? 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]'
                  : 'border-[#fee39f] bg-[#fff7e6] text-[#9a5f12]'
              }`}
            >
              <div className="flex items-start gap-3">
                {feedback.type === 'success' ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <AlertTriangle size={20} />
                )}
                <p>{feedback.message}</p>
              </div>
            </div>
          )}

          <section className="mb-5">
            <div className="mb-3">
              <h2>Profile details</h2>
              <p className="steps-text mt-1">
                These details are saved to the user profile.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <label htmlFor="full_name">
                Full name
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  placeholder="Full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  autoComplete="name"
                />
                <FieldError message={errors.full_name} />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label htmlFor="phone">
                  <span className="flex items-center gap-2">
                    <Phone size={16} />
                    Phone
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+966..."
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                  <FieldError message={errors.phone} />
                </label>

                <label htmlFor="email">
                  <span className="flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                  <FieldError message={errors.email} />
                </label>
              </div>

              <label htmlFor="address">
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  Address
                </span>
                <input
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                />
                <FieldError message={errors.address} />
              </label>
            </div>
          </section>

          <section className="mb-5">
            <div className="mb-3">
              <h2>Role</h2>
              <p className="steps-text mt-1">
                {selectedRole?.description || 'Select what this user can do.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {ROLE_OPTIONS.map((option) => (
                <RoleCard
                  key={option.value}
                  option={option}
                  selected={formData.role === option.value}
                  onSelect={handleRoleSelect}
                />
              ))}
            </div>
            <FieldError message={errors.role} />
          </section>

          <section className="mb-5">
            <div className="mb-3">
              <h2>Temporary password</h2>
              <p className="steps-text mt-1">
                Give the user a temporary password they can use for first sign
                in.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <label htmlFor="password">
                Temporary password
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
                <FieldError message={errors.password} />
              </label>

              <label htmlFor="confirmPassword">
                Confirm password
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                />
                <FieldError message={errors.confirmPassword} />
              </label>
            </div>
          </section>

          <button type="submit" disabled={loading} className="button-big">
            {loading ? 'Creating account...' : 'Create user'}
          </button>
        </div>
      </form>
    </div>
  );
}
