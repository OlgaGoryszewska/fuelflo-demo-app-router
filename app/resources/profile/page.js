'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import avatar from '@/public/avatar.png';
import banner from '@/public/banner.jpg';
import LogoutIcon from '@mui/icons-material/Logout';

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace('/signIn');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name, phone, role, address')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

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

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error logging out:', error.message);
      setLoggingOut(false);
      return;
    }

    router.replace('/');
  };

  if (loading) return <p>Loading profile...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <div>
      <div className="banner">
        <Image src={banner} alt="banner" className="banner" />
        <Image className="avatar-big" src={avatar} alt="avatar img" />
      </div>

      <div className="main-container">
        <h2 className="m-auto mt-10">{profile?.full_name}</h2>

        <div className="background-container mt-2">
          <p className="h-mid-gray-s">Contact</p>
          <p className="steps-text">{profile?.phone}</p>
          <p className="steps-text">{profile?.email}</p>

          <div className="divider-full"></div>

          <p className="h-mid-gray-s">Role</p>
          <p className="steps-text">{profile?.role}</p>

          <div className="divider-full"></div>

          <p className="h-mid-gray-s">Address</p>
          <p className="steps-text">{profile?.address}</p>

          {/* 🔴 Logout */}
          <div className="divider-full mt-4"></div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="profile-logout-button mt-4"
          >
            <LogoutIcon fontSize="small" />
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}