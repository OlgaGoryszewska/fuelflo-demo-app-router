'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

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
    else router.push('/dashboard');
  };

  return (
    <div className='flex flex-col'>
      <img src="/login.png" alt="welcome img" className="w-32 mx-auto" />
      <h2 className='mx-auto'>Sign in to Fuelflo</h2>
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
          className="mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <div className='divider-full mb-4'></div>
      <button className="button-big " onClick={handleSignIn}>
        Sign In
      </button>
    </div>
  );
}
