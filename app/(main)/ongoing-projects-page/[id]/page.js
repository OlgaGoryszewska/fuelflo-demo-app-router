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

      // NOTE: adjust these column names to match your schema.
      // If your DB uses snake_case: use release_date/end_date.
      // If you created camelCase columns with quotes, use: '"endDate"'
      const columns = [
        'id',
        'name',
        'location',
        'endDate', // or 'end_date'  OR  '"endDate"'
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
      <div className="background-container">
        <div className="dashed-line">
          <span className="material-symbols-outlined">workspaces</span>
          <h1>Project</h1>
        </div>

        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">workspaces</span>
          <p>Name of the Project:</p>
        </div>
        <p className="form-data-to-read">{project.name ?? '—'}</p>
        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">location_on</span>
          <p>Localisation of the project:</p>
        </div>
        <p className="form-data-to-read">{project.location ?? '—'}</p>
        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">today</span>
          <p>Release Date:</p>
        </div>
        <p className="form-data-to-read">{project.releaseDate ?? '—'}</p>
        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">today</span>
          <p>End Date:</p>
        </div>
        <p className="form-data-to-read">{project.endDate ?? '—'}</p>
        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">contacts_product</span>
          <p>Name of the Contractor:</p>
        </div>
        <p className="form-data-to-read">{project.contractor_name ?? '—'}</p>
        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">location_on</span>
          <p>Address of the Contractor:</p>
        </div>
        <p className="form-data-to-read">{project.contractor_address ?? '—'}</p>
        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">mail</span>
          <p>Email:</p>
        </div>
        <p className="form-data-to-read">{project.email ?? '—'}</p>
        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">mobile</span>
          <p>Mobile:</p>
        </div>
        <p className="form-data-to-read">{project.mobile ?? '—'}</p>
        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">person_apron</span>
          <p>Add technician:</p>
        </div>
        <p className="form-data-to-read">{project.technician ?? '—'}</p>
        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">battery_charging_50</span>
          <p>Add Generator:</p>
        </div>
        <p className="form-data-to-read">{project.generator ?? '—'}</p>

        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">oil_barrel</span>
          <p>Add Fuel Tank:</p>
        </div>
        <p className="form-data-to-read">{project.tank ?? '—'}</p>

        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">attach_money</span>
          <p>Purchase Price:</p>
        </div>
        <p className="form-data-to-read">{project.amount ?? '—'}</p>

        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">attach_money</span>
          <p>Selling Price:</p>
        </div>
        <p className="form-data-to-read">{project.selling_price ?? '—'}</p>

        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">sticky_note_2</span>
          <p>Specification of the project:</p>
        </div>
        <p className="form-data-to-read">{project.specification ?? '—'}</p>

        <div className="flex items-center align-center">
          <span className="material-symbols-outlined">note_stack_add</span>
          <p>Additional Note:</p>
        </div>
        <p className="form-data-to-read">{project.additional ?? '—'}</p>
        <div className="dashed-card">
            <h2>FUEL DELIVERY</h2>
        </div>
      </div>
    </div>
  );
}
