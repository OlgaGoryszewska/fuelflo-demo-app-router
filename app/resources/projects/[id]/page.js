'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ChevronDown } from 'lucide-react';
// icons
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import OilBarrelOutlinedIcon from '@mui/icons-material/OilBarrelOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

export default function ProjectDetailPage() {
  const { id: projectId } = useParams();
  const [openCard, setOpenCard] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleCard = (cardName) => {
    setOpenCard((prev) => (prev === cardName ? null : cardName));
  };

  useEffect(() => {
    if (!projectId) return;

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

      const idValue = isNaN(Number(projectId)) ? projectId : Number(projectId);

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
  }, [projectId]);

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
        <h1 className="ml-2">{project.name}</h1>
      </div>
      <div className="background-container mb-4">
        <div className=" small-button-green ml-auto ">
          <div>Active</div>
        </div>
        <div className="divider-full"></div>

        {project.location && (
          <div className="w-full h-64">
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
        <div className="flex items-start">
          <LocationOnOutlinedIcon />
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
        <div className="flex flex-col justify-between ">
          <div className="flex flex-row justyfy-center items-center">
            <InsertInvitationOutlinedIcon />
            <p>Starting date</p>
            <div className="date-box">
              <p className="generator-localisation">
                {project.start_date ?? 'Lack of information'}
              </p>
            </div>
          </div>
          <div className="flex flex-row justyfy-center items-center">
            <InsertInvitationOutlinedIcon />
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
            <BoltOutlinedIcon />

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
            <OilBarrelOutlinedIcon />

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
            <EngineeringOutlinedIcon />

            <p>
              {project.technician
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
          <BoltOutlinedIcon />
          <h3 className="ml-2 uppercase">Fuel Transactions</h3>
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
          <Person4OutlinedIcon />
          <h3 className="ml-2 uppercase">event organizer</h3>
        </div>

        <h2>{project.contractor_name ?? '-'}</h2>
        <div className="flex gap-2align-center mb-2">
          <ApartmentOutlinedIcon />
          <p className="generator-localisation">
            {project.company_name ?? '-'}
          </p>
        </div>
        <div className="flex align-center mb-2">
          <LocationOnOutlinedIcon />
          <p className="generator-localisation">
            {project.contractor_address ?? '-'}
          </p>
        </div>
        <div className="flex align-center mb-2">
          <AlternateEmailOutlinedIcon />
          <p className="generator-localisation">{project.email ?? '-'}</p>
        </div>
        <div className="flex align-center mb-2">
          <CallOutlinedIcon />
          <p className="generator-localisation">{project.mobile ?? '-'}</p>
        </div>
      </div>
      <div className="background-container mb-4">
        <div className="form-header mb-4">
          <Person4OutlinedIcon />
          <h3 className="ml-2 uppercase">fuel suppliers</h3>
        </div>

        <h2>{project.contractor_name ?? '-'}</h2>
        <div className="flex align-center mb-2">
          <ApartmentOutlinedIcon />
          <p className="generator-localisation">
            {project.company_name ?? '-'}
          </p>
        </div>
        <div className="flex align-center mb-2">
          <LocationOnOutlinedIcon />
          <p className="generator-localisation">
            {project.contractor_address ?? '-'}
          </p>
        </div>
        <div className="flex align-center mb-2">
          <AlternateEmailOutlinedIcon />
          <p className="generator-localisation">{project.email ?? '-'}</p>
        </div>
        <div className="flex align-center mb-2">
          <CallOutlinedIcon />
          <p className="generator-localisation">{project.mobile ?? '-'}</p>
        </div>
      </div>
      <Link
        className="form-button-orange"
        href={`/resources/projects/${projectId}/new/`}
      >
        <AddOutlinedIcon />
        Add Fuel Transaction
      </Link>
    </div>
  );
}
