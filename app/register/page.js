'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  UserRound,
  UsersRound,
  Wrench,
} from 'lucide-react';
import {
  TransactionFieldCard,
  TransactionValidationMessage,
} from '@/components/fuel-transaction/TransactionUi';

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

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-semibold text-[#b45309]">
      {message}
    </p>
  );
}

function TextField({
  id,
  label,
  icon: Icon,
  error,
  className = '',
  ...inputProps
}) {
  const errorId = `${id}-error`;

  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="mb-1.5 flex items-center gap-2 !text-[var(--slate-dark)]">
        {Icon && <Icon size={16} strokeWidth={2.2} />}
        {label}
      </span>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-12 rounded-2xl border bg-white px-3.5 text-base text-[#171e2c] outline-none transition placeholder:text-[#9aa7b5] focus:border-[#7291a4] focus:ring-4 focus:ring-[#d5eefc]/60 ${
          error ? 'border-[#f6d78c] bg-[#fffaf0]' : 'border-[#e2e8f0]'
        }`}
        {...inputProps}
      />
      <FieldError id={errorId} message={error} />
    </label>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  visible,
  onToggleVisible,
  placeholder,
}) {
  const errorId = `${id}-error`;
  const ToggleIcon = visible ? EyeOff : Eye;

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block !text-[var(--slate-dark)]">
        {label}
      </span>
      <span
        className={`flex h-12 items-center rounded-2xl border bg-white pr-1.5 transition focus-within:border-[#7291a4] focus-within:ring-4 focus-within:ring-[#d5eefc]/60 ${
          error ? 'border-[#f6d78c] bg-[#fffaf0]' : 'border-[#e2e8f0]'
        }`}
      >
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-3.5 text-base text-[#171e2c] outline-none placeholder:text-[#9aa7b5] focus:ring-0"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#62748e] transition active:scale-95 active:bg-[#eef4fb]"
        >
          <ToggleIcon size={18} strokeWidth={2.2} />
        </button>
      </span>
      <FieldError id={errorId} message={error} />
    </label>
  );
}

function RoleCard({ option, selected, onSelect }) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`flex min-h-[92px] w-full items-start gap-3 rounded-[22px] border p-4 text-left transition active:scale-[0.98] ${
        selected
          ? 'border-[#f6d78c] bg-[#fff7e6] ring-1 ring-[#f6d78c]'
          : 'border-[#e2e8f0] bg-white active:border-[#d5eefc] active:bg-[#eef4fb]'
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
        <span className="block text-base font-semibold text-gray-900">
          {option.label}
        </span>
        <span className="steps-text mt-1 block leading-5">
          {option.description}
        </span>
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="main-container">
      <div className="form-header mt-4">
        <h1 className="ml-2">User management</h1>
      </div>

      <form className="form-transaction" onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2>Add new user</h2>
          <p className="steps-text mt-1">
            Create a profile, assign access, and set a temporary password.
          </p>
        </div>

        {feedback.message &&
          (feedback.type === 'success' ? (
            <div
              className="mb-4 rounded-xl border border-[#d7edce] bg-[#f3fbef] p-3 text-sm font-medium text-[#2f8f5b]"
              role="status"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} />
                <p>{feedback.message}</p>
              </div>
            </div>
          ) : feedback.type === 'warning' ? (
            <TransactionValidationMessage>
              {feedback.message}
            </TransactionValidationMessage>
          ) : (
            <p
              className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
              role="alert"
            >
              {feedback.message}
            </p>
          ))}

        <div className="space-y-4">
          <TransactionFieldCard
            icon={UserRound}
            title="Profile details"
            description="These details are saved to the user profile."
          >
            <div className="grid grid-cols-1 gap-4">
              <TextField
                id="full_name"
                type="text"
                name="full_name"
                label="Full name"
                icon={UserRound}
                placeholder="Full name"
                value={formData.full_name}
                onChange={handleChange}
                autoComplete="name"
                error={errors.full_name}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TextField
                  id="phone"
                  type="tel"
                  name="phone"
                  label="Phone"
                  icon={Phone}
                  placeholder="+966..."
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  error={errors.phone}
                />

                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                  error={errors.email}
                />
              </div>

              <TextField
                id="address"
                type="text"
                name="address"
                label="Address"
                icon={MapPin}
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                autoComplete="street-address"
                error={errors.address}
              />
            </div>
          </TransactionFieldCard>

          <TransactionFieldCard
            icon={ShieldCheck}
            title="Role"
            description={
              selectedRole?.description || 'Select what this user can do.'
            }
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ROLE_OPTIONS.map((option) => (
                <RoleCard
                  key={option.value}
                  option={option}
                  selected={formData.role === option.value}
                  onSelect={handleRoleSelect}
                />
              ))}
            </div>
            <FieldError id="role-error" message={errors.role} />
          </TransactionFieldCard>

          <TransactionFieldCard
            icon={Eye}
            title="Temporary password"
            description="Give the user a temporary password they can use for first sign in."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PasswordField
                id="password"
                label="Temporary password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                visible={showPassword}
                onToggleVisible={() => setShowPassword((current) => !current)}
                placeholder="At least 8 characters"
              />

              <PasswordField
                id="confirmPassword"
                label="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                visible={showConfirmPassword}
                onToggleVisible={() =>
                  setShowConfirmPassword((current) => !current)
                }
                placeholder="Repeat password"
              />
            </div>
          </TransactionFieldCard>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            disabled
            className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-gray-100 bg-white px-4 text-sm font-semibold text-gray-800 shadow-sm transition disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-[#d5eefc] bg-[#eef4fb] px-4 text-sm font-semibold text-gray-900 shadow-sm transition active:scale-[0.98] active:bg-[#dbeaf5] disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create user'}
          </button>
        </div>
      </form>
    </div>
  );
}
