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
          <div className=" small-button-green ml-auto ">
            <div>Active</div>
          </div>
        </div>

        <div className="flex items-start">
          <span className="material-symbols-outlined">location_on</span>
          {project.location ? (
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                project.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="generator-localisation underline text-blue-600"
            >
              {project.location}
            </Link>
          ) : (
            <p className="generator-localisation">Lack of information</p>
          )}
        </div>
        {project.location && (
          <div className="mt-4 w-full h-64">
            <iframe
              title="Project location map"
              className="w-full h-full rounded-lg border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${
                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
              }&q=${encodeURIComponent(project.location)}`}
              allowFullScreen
            />
          </div>
        )}

        <div />
        <div className="flex flex-col justify-between ">
          <div className="flex flex-row justyfy-center items-center">
            <span className="material-symbols-outlined ">today</span>
            <p>Starting date</p>
            <div className="date-box">
              <p className="generator-localisation">
                {project.start_date ?? 'Lack of information'}
              </p>
            </div>
          </div>
          <div className="flex flex-row justyfy-center items-center">
            <span className="material-symbols-outlined ">today</span>
            <p>End date</p>
            <div className="date-box">
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
          <span className="material-symbols-outlined">swap_horiz</span>
          <h3 className="ml-2 uppercase">Fuel Transactions</h3>
          <Link
            className=" small-button ml-auto "
            href={`/resources/ongoing-projects-page/${project.id}/add-fuel-transactions-page`}
          >
            <div>Add Delivery</div>
          </Link>
        </div>

        <div className="flex flex-col items-center align-center">
          <div className="background-header p-0">
            <p>Date</p>
            <p>Vol</p>
          </div>
          <div className="file-row">
            <p>09.09/25</p>
            <p>- 5000 L</p>
          </div>
          <div className="file-row">
            <p>09.09/25</p>
            <p> + 5000 L</p>
          </div>
        </div>
      </div>
      <div className="background-container mb-4">
        <div className="form-header mb-4">
          <span className="material-symbols-outlined">festival</span>
          <h3 className="ml-2 uppercase">event organizer</h3>
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
      <div className="background-container mb-4">
        <div className="form-header mb-4">
          <span className="material-symbols-outlined">delivery_truck_bolt</span>
          <h3 className="ml-2 uppercase">fuel suppliers</h3>
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
        <Link
          href={`/add-forms/add-fuel-transactions-page?projectId=${project.id}`}
        >
          <div>Add Fuel Transaction</div>
        </Link>
      </button>
    </div>
  );
}
