'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import avatar from '@/public/avatar.png';
import banner from '@/public/banner.jpg';

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
          .select('id, email, full_name, phone, role, address')
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
    <div className="">
      <h1 className="ml-2 mt-2 hidden ">My Profile</h1>

      <div className="">
        <div className="banner">
          <Image src={banner} alt="banner" fill className="banner" />
          <Image className="avatar-big" src={avatar} alt="avatar img" />
        </div>

        <div className="main-container">
          <h2 className="m-auto mt-10">{profile?.full_name}</h2>
          <div className="background-container mt-2">
            <p className="h-mid-gray-s"> Contact</p>
            <p className="steps-text"> {profile?.phone}</p>
            <p className="steps-text"> {profile?.email}</p>
            <div className="divider-full"></div>
            <p className="h-mid-gray-s">Rolle</p>
            <p className="steps-text"> {profile?.role}</p>
            <div className="divider-full"></div>
            <p className="h-mid-gray-s">Address</p>
            <p className="steps-text">{profile?.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
