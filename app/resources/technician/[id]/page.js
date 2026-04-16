'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

import Image from 'next/image';
import avatar from '@/public/avatar.png';
import banner from '@/public/banner.jpg';

export default function TechnicianDetailPage() {
  const { id } = useParams();

  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, role, address')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        setError(error.message);
        setTechnician(null);
      } else {
        setTechnician(data);
      }
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading)
    return (
      <div className="main-container">
        <div className="background-container">Loading…</div>
      </div>
    );
  if (error)
    return (
      <div className="main-container">
        <div className="background-container">Error: {error}</div>
      </div>
    );
  if (!technician)
    return (
      <div className="main-container">
        <div className="background-container">Technician not found.</div>
      </div>
    );

  return (
    <div className="">
      <h1 className="ml-2 mt-2 hidden ">Technician page</h1>

      <div className="">
        <div className="banner">
          <Image src={banner} alt="banner" className="banner" />
          <Image className="avatar-big" src={avatar} alt="avatar img" />
        </div>

        <div className="main-container">
          <h2 className="m-auto mt-10">{technician?.full_name}</h2>
          <div className="background-container mt-2">
            <p className="h-mid-gray-s"> Contact</p>
            <p className="steps-text"> {technician?.phone}</p>
            <p className="steps-text"> {technician?.email}</p>
            <div className="divider-full"></div>
            <p className="h-mid-gray-s">Rolle</p>
            <p className="steps-text"> {technician?.role}</p>
            <div className="divider-full"></div>
            <p className="h-mid-gray-s">Address</p>
            <p className="steps-text">{technician?.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
