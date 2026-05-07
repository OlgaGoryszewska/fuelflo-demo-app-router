'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import formatDateShort from '@/components/FormatDateShort';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function TechniciansPage() {
  const [profile, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'hire_desk')
        .order('full_name', { ascending: false });

      if (error) setError(error.message);
      setProfiles(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingIndicator />;

  return (
    <div className="main-container">
      <div>
        <div className="form-header ">
          <h1 className="ml-2">Hire Desk</h1>
        </div>
        <div className="background-container">
          <div className="flex flex-col w-full"></div>
          <div className="pr-2 w-full flex justify-between">
            <h4 className="pl-2">Name</h4>
            <h4>Active project</h4>
          </div>
          <ul className="flex flex-col gap-1 ">
            {profile.map((p) => (
              <li className="file-row " key={p.id}>
                <Link
                  className="steps-text"
                  href={`/resources/technician/${p.id}`}
                >
                  {p.full_name}
                </Link>
                <p className="steps-text "> {formatDateShort(p.start_date)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
