'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        console.log('user:', user);

        if (userError || !user) {
          router.push('/signIn');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, phone, role, address')
          .eq('id', user.id)
          .maybeSingle();

        console.log('profile:', data);

        if (error) {
          throw error;
        }

        if (!data) {
          setErrorMessage('No profile found for this user.');
          return;
        }

        setProfile(data);
      } catch (error) {
        setErrorMessage(error.message || 'Could not load profile.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div className="main-container">
      <div className="register-card">
        <h1>My Profile</h1>

        <p><strong>Full name:</strong> {profile?.full_name}</p>
        <p><strong>Phone:</strong> {profile?.phone}</p>
        <p><strong>Role:</strong> {profile?.role}</p>
        <p><strong>Address:</strong> {profile?.address}</p>
      </div>
    </div>
  );
}