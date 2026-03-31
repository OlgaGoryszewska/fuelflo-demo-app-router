'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import login from '@/public/login.png';

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
    else router.push('/operations/dashboard');
  };

  return (
    <div className="flex flex-col">
      <Image src={login} alt="welcome img" className="w-32 mx-auto" />
      <h2 className="mx-auto">Sign in to FuelFlo</h2>
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
      <h4>Don’t have an account? Contact Hire Desk</h4>

      <div className="divider-full my-4"></div>
      <button className="button-big " onClick={handleSignIn}>
        Sign In
      </button>
    </div>
  );
}
