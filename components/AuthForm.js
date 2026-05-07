'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import FloLogo from '@/public/flo-logo.png';
import { TransactionFieldCard } from '@/components/fuel-transaction/TransactionUi';

const ROLE_ROUTES = {
  technician: '/operations/dashboard/technician',
  manager: '/operations/dashboard/manager',
  hire_desk: '/operations/dashboard/hire-desk',
  fuel_supplier: '/resources/profile',
  event_organizer: '/resources/profile',
};

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Enter your email and password to continue.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const user = data.user;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        setErrorMessage('Could not load your role. Please try again.');
        return;
      }

      router.push(ROLE_ROUTES[profile.role] || '/resources/projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-transaction" onSubmit={handleSignIn}>
      <div className="mb-5 text-center">
        <Image
          src={FloLogo}
          alt="FuelFlo"
          className="mx-auto h-auto w-24"
          priority
        />
        <h2 className="mt-4">Sign in to FuelFlo</h2>
        <p className="steps-text mt-1">
          Access projects, transactions, and field operations.
        </p>
      </div>

      {errorMessage && (
        <p className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
          <AlertCircle size={18} />
          {errorMessage}
        </p>
      )}

      <TransactionFieldCard
        icon={Lock}
        title="Account access"
        description="Use your FuelFlo account credentials."
      >
        <div className="grid grid-cols-1 gap-4">
          <label htmlFor="email">
            <span className="mb-1.5 flex items-center gap-2">
              <Mail size={16} />
              Email
            </span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label htmlFor="password">
            <span className="mb-1.5 flex items-center gap-2">
              <Lock size={16} />
              Password
            </span>
            <span className="flex h-12 items-center rounded-[10px] border border-[var(--primary-gray-light)] bg-white pr-1.5">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-base outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#62748e] transition active:scale-95 active:bg-[#eef4fb]"
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2.2} />
                ) : (
                  <Eye size={18} strokeWidth={2.2} />
                )}
              </button>
            </span>
          </label>
        </div>
      </TransactionFieldCard>

      <p className="steps-text mt-4 text-center">
        Need access? Contact the hire desk team.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl border border-[#d5eefc] bg-[#eef4fb] px-4 text-sm font-semibold text-gray-900 shadow-sm transition active:scale-[0.98] active:bg-[#dbeaf5] disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
