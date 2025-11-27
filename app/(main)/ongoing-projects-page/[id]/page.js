'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ChevronDown } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [openCard, setOpenCard] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleCard = (cardName) => {
    setOpenCard((prev) => (prev === cardName ? null : cardName));
  };

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
        'generator_id',
        'tank',
        'amount',
        'selling_price',
        'specification',
        'additional',
        'company_name',
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
      <div className="background-container mb-4">
        <div className="form-header mb-4">
          <span className="material-symbols-outlined">workspaces</span>
          <h3 className="ml-2 uppercase">{project.name}</h3>
          <Link
            className=" small-button-green ml-auto "
            href="/add-fuel-delivery"
          >
            <div>Active</div>
          </Link>
        </div>

        <div className="flex items-start mb-2">
          <span className="material-symbols-outlined tin ">location_on</span>
          <p className="generator-localisation"> {project.location}</p>
        </div>
        <div />
        <div className="flex flex-row justify-between ">
          <div className="flex flex-col justyfy-center items-center">
            <p>Starting date</p>
            <div className="date-box">
              <span className="material-symbols-outlined tin">today</span>
              <p className="generator-localisation">
                {project.start_date ?? 'Lack of information'}
              </p>
            </div>
          </div>
          <div className="flex flex-col justyfy-center items-center">
            <p>End date</p>
            <div className="date-box">
              <span className="material-symbols-outlined tin">today</span>
              <p className="generator-localisation">
                {project.end_date ?? 'Lack of information'}
              </p>
            </div>
          </div>
        </div>
        <div
          onClick={() => toggleCard('generators')}
          className="flex flex-row mt-4 pb-2 border-b border-b-gray-200 align-middle"
        >
          <p className="">Generators</p>
          <ChevronDown
            className={`ml-auto transition-transform text-gray-400 ${openCard === 'generators' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'generators' && (
          <div className="card-button">
            <span className="material-symbols-outlined">bolt</span>

            <p>
              {project.generator_id
                ? project.generator_id
                : 'No generators connected.'}
            </p>
          </div>
        )}
        <div
          onClick={() => toggleCard('tanks')}
          className="flex flex-row mt-4 pb-2 border-b border-b-gray-200 align-middle"
        >
          <p className="pt-3">External tanks</p>
          <ChevronDown
            className={`ml-auto transition-transform text-gray-400 ${openCard === 'tanks' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'tanks' && (
          <div className="card-button">
            <span className="material-symbols-outlined">gas_meter</span>

            <p>
              {project.tank ? project.tank : 'No external tanks connected.'}
            </p>
          </div>
        )}

        <div
          onClick={() => toggleCard('technicians')}
          className="flex flex-row mt-4 pb-2 border-b border-b-gray-200 align-middle"
        >
          <p className="pt-3">Technicians</p>
          <ChevronDown
            className={`ml-auto transition-transform text-gray-400 ${openCard === 'technicians' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'technicians' && (
          <div className="card-button">
            <span className="material-symbols-outlined">person_apron</span>

            <p>
              {project.generator
                ? project.technician
                : 'No technicians assigned.'}
            </p>
          </div>
        )}

        <div className="gen-grid pb-4">
          <div className="project-inf-box">
            <p className="box-text">Fuel Purchase Price</p>
            <p className="box-insert">{project.amount}</p>
          </div>
          <div className="project-inf-box">
            <p className="box-text">Fuel Selling Price</p>
            <p className="box-insert">{project.selling_price}</p>
          </div>
          <div className="project-inf-box">
            <p className="box-text">Estimated Earnings</p>
            <p className="box-insert">{project.selling_price}</p>
          </div>
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
      <div className="background-container mb-4">
        <div className="form-header mb-4">
          <span className="material-symbols-outlined">contacts_product</span>
          <h3 className="ml-2 uppercase">contractor</h3>
        </div>

        <h2>{project.contractor_name ?? '-'}</h2>
        <div className="flex align-center mb-2">
          <span className="material-symbols-outlined tin ">location_city</span>
          <p className="generator-localisation">
            {project.company_name ?? '-'}
          </p>
        </div>
        <div className="flex align-center mb-2">
          <span className="material-symbols-outlined tin">location_on</span>
          <p className="generator-localisation">
            {project.contractor_address ?? '-'}
          </p>
        </div>
        <div className="flex align-center mb-2">
          <span className="material-symbols-outlined tin">email</span>
          <p className="generator-localisation">{project.email ?? '-'}</p>
        </div>
        <div className="flex align-center mb-2">
          <span className="material-symbols-outlined tin">mobile</span>
          <p className="generator-localisation">{project.mobile ?? '-'}</p>
        </div>
      </div>
      <button className=" button-big ">
        <Link href="/add-fuel-delivery">
          <div>Add Fuel Delivery</div>
        </Link>
      </button>
    </div>
  );
}
