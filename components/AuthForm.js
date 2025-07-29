'use client';

import { useState } from 'react';
import { supabase } from '../lib/SupabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert('Signed in!');
  };

  return (
    <div>
      <img src="/welcome.png" alt="welcome img" className="pb-4" />
      <h1>Log in to Fuelflo</h1>
      <p className="body-text">
        Access your dashboard and manage your fuel operations with
        confidence. We are here to support your success—every step of the way.
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button className="button-big" onClick={handleSignIn}>
        Sign In
      </button>
    </div>
  );
}
