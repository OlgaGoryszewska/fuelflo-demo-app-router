'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {useRouter} from 'next/navigation';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else (router.push('/dashboard'));
  };

  return (
    <div>
      <img src="/login.png" alt="welcome img" className="w-1/2 mx-auto" />
      <h2>Log in to Fuelflo</h2>
      <p className="body-text">
        Access your dashboard and manage your fuel operations with confidence.
        We are here to support your success—every step of the way.
      </p>
      <label>
        Email:
        <input
          className="mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          className="mb-8"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button className="button-big " onClick={handleSignIn}>
        Sign In
      </button>
    </div>
  );
}
