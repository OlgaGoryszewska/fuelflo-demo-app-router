'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setError(null);
      setLoading(true);

      const columns = [
        'id',
        'name',
        'location',
        'start_date',
        'end_date',
        'contractor_name',
        'contractor_address',
        'email',
        'mobile',
        'technician',
        'generator',
        'tank',
        'amount',
        'selling_price',
        'specification',
        'additional',
      ].join(',');

      const idValue = isNaN(Number(id)) ? id : Number(id);

      const { data, error } = await supabase
        .from('projects')
        .select(columns)
        .eq('id', idValue)
        .single();

      if (error) {
        setError(error.message);
        setProject(null);
      } else {
        setProject(data);
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
  if (!project)
    return (
      <div className="main-container">
        <div className="background-container">Project not found.</div>
      </div>
    );

  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Project</h1>
      </div>
      <div className="background-container mb-8">
        <div className="form-header mb-4">
          <span className="material-symbols-outlined">workspaces</span>
          <h3 className="ml-2 uppercase">{project.name}</h3>
        </div>

        <div className="flex items-start mb-2">
          <span className="material-symbols-outlined tin ">location_on</span>
          <p className="generator-localisation"> {project.location}</p>
        </div>
        <div />
        <div className="flex flex-row justify-evenly">
          <div div className="flex flex-col justyfy-center items-center">
            <p className="generator-localisation">🚀 Starting date</p>
            <div className="date-box">
              <span className="material-symbols-outlined tin">today</span>
              <p className="generator-localisation">
                {project.start_date ?? 'Lack of information'}
              </p>
            </div>
          </div>
          <div className="flex flex-col justyfy-center items-center">
            <p className="generator-localisation">🏁 End date</p>
            <div className="date-box">
              <span className="material-symbols-outlined tin">today</span>
              <p className="generator-localisation">
                {project.end_date ?? 'Lack of information'}
              </p>
            </div>
          </div>
        </div>
        <p className="pt-3">Generators</p>
        <div className="card-button">
          <span className="material-symbols-outlined">bolt</span>

          <p>
            {project.generator ? project.generator : 'No generators connected.'}
          </p>
        </div>

        <p className="pt-3">External tanks</p>
        <div className="card-button">
          <span className="material-symbols-outlined">bolt</span>

          <p>{project.tank ? project.tank : 'No external tanks connected.'}</p>
        </div>
      </div>

      <div className="generator-container mb-4">
        <div className="form-header-with-button ">
          <span className="material-symbols-outlined">
            delivery_truck_speed
          </span>
          <h3 className="ml-2 uppercase">Fuel Delivery</h3>
          <Link className=" small-button ml-auto " href="/add-fuel-delivery">
            <div>Add Delivery</div>
          </Link>
        </div>

        <div className="flex flex-col items-center align-center">
          <div className="background-header p-0">
            <p>Date</p>
            <p>Volume</p>
            <p>File</p>
          </div>
          <div className="file-row">
            <p>09.09/25</p>
            <p>5000L</p>
            <span className="material-symbols-outlined">folder</span>
          </div>
          <div className="file-row">
            <p>09.09/25</p>
            <p>5000L</p>
            <span className="material-symbols-outlined">folder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
