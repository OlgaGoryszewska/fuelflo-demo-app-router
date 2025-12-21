'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import * as React from 'react';


export default function EventOrganizerPage({ params }) {
  const { id } = React.use(params);
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setError(null);
      const { data, error } = await supabase
        .from('event_organizers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setOrganizer(data);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!organizer) return <div>No organizer found.</div>;

  return (
    <div className="m-2.5">
      <div className="form-header mb-4">
        <h1 className="ml-2">Event Organizer Details</h1>
      </div>
      <div className="background-container-white p-4">
        <h2>{organizer.name} {organizer.surname}</h2>
        <p>Company: {organizer.company_name}</p>
        <p>Address: {organizer.address}</p>
        <p>Email: {organizer.email}</p>
        <p>Mobile: {organizer.mob}</p>
      </div>
    </div>
  );
}