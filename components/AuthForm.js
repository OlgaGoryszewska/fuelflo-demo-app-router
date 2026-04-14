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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    // Fetch user role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      alert('Error fetching user role');
      return;
    }

    // 🎯 Role-based routing
    switch (profile.role) {
      case 'technician':
        router.push('/operations/dashboard/technician');
        break;
      case 'manager':
        router.push('/operations/dashboard/manager');
        break;
      case 'hire_desk':
        router.push('/operations/dashboard/hire-desk');
        break;
      case 'fuel_supplier':
        router.push('/operations/dashboard/fuel-supplier');
        break;
      default:
        router.push('/operations/dashboard/technician'); // fallback
    }
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
