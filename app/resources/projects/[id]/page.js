'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ChevronDown } from 'lucide-react';

import Link from 'next/link';
import formatDate from '@/components/FormatDate';
// icons
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import OilBarrelOutlinedIcon from '@mui/icons-material/OilBarrelOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';

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
      <div className="background-container-white mb-4">
        <h2 className="mt-2">Project Details</h2>
        <h4 className="h-mid-gray-s">{project.name}</h4>

        {project.location && (
          <div className="w-full h-54 ">
            <iframe
              title="Project location map"
              className="w-full h-full rounded-lg border-0"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                project.location
              )}&output=embed`}
              allowFullScreen
            />
          </div>
        )}

        <div />
        <div className="flex items-start">
          <LocationOnOutlinedIcon className="gray-icon" />
          
          {project.location ? (
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                project.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="s-bold-text"
            >
              {project.location}
            </Link>
          
          ) : (
            <p className="steps-text">Lack of information</p>
          )} 
        </div>
        
        <div className="grid grid-cols-2 gap-2">
        <div className="container-flex ">
          <h4 className="">Starting date</h4>
          <p className="steps-text">
            {formatDate(project.start_date ?? 'Lack of information')}
          </p>
        </div>
        <div className="container-flex">
          <div className="flex flex-row">
            <h4 className="">End date</h4>
          </div>

          <p className="steps-text">
            {formatDate(project.end_date ?? 'Lack of information')}
          </p>
          </div>
        </div>
      </div>
      <div className="background-container mb-4">
        <p className="steps-text">Assigned to the project</p>

        <div
          onClick={() => toggleCard('generators')}
          className="flex flex-row mt-2 pb-2 border-b border-b-gray-200 align-middle"
        >
          <p className="h-mid-gray-s">Generators</p>
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
          <p className="h-mid-gray-s">External tanks</p>
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
          <p className="h-mid-gray-s">Technicians</p>
          <ChevronDown
            className={`ml-auto transition-transform text-gray-400 ${openCard === 'technicians' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'technicians' && (
          <div className="card-button">
            <EngineeringOutlinedIcon className="gray-icon" />

            <p>
              {project.technician
                ? project.technician
                : 'No technicians assigned.'}
            </p>
          </div>
        )}
      </div>
      <div className="background-container mb-4">
        <h2>Fuel Financials</h2>
        <p className="steps-text">Live pricing & margin intelligence</p>
        <div className="gen-grid pb-4">
          <div className="project-inf-box">
            <h4 className="box-text">Purchase Price</h4>
            <p className="box-insert">{project.amount} SAR/L</p>
          </div>
          <div className="project-inf-box">
            <h4 className="box-text">Selling Price</h4>
            <p className="box-insert">{project.selling_price} SAR/L</p>
          </div>
          <div className="project-inf-box-green">
            <h4 className="box-text">Profit</h4>
            <p className="box-insert">{project.selling_price} SAR/L</p>
          </div>
        </div>
      </div>
      <button className="button-big">
        {' '}
        <Link href={`/resources/projects/${projectId}/new/`}>
          Add Fuel Transaction
        </Link>
      </button>

      <div className="background-container mb-4">
        <div className="form-header ">
          <h3 className=" uppercase">event organizers</h3>
        </div>
        <div className="divider-full "></div>

        <h2>{project.contractor_name ?? '-'}</h2>
        <div className="flex gap-2align-center mb-2">
          <ApartmentOutlinedIcon className="mr-2" />
          <p className="generator-localisation">
            {project.company_name ?? '-'}
          </p>
        </div>
        <div className="flex align-center mb-2">
          <LocationOnOutlinedIcon className=" mr-2" />
          <p className="generator-localisation">
            {project.contractor_address ?? '-'}
          </p>
        </div>
        <div className="flex align-center mb-2">
          <AlternateEmailOutlinedIcon className="mr-2" />
          <p className="generator-localisation">{project.email ?? '-'}</p>
        </div>
        <div className="flex align-center mb-2">
          <CallOutlinedIcon className="mr-2" />
          <p className="generator-localisation">{project.mobile ?? '-'}</p>
        </div>
      </div>
      <div className="background-container mb-4">
        <div className="form-header">
          <h3 className=" uppercase">fuel suppliers</h3>
        </div>
        <div className="divider-full "></div>

        <h2>{project.contractor_name ?? '-'}</h2>
        <div className="flex align-center mb-2">
          <ApartmentOutlinedIcon className="mr-2" />
          <p className="generator-localisation">
            {project.company_name ?? '-'}
          </p>
        </div>
        <div className="flex align-center mb-2">
          <LocationOnOutlinedIcon className="mr-2" />
          <p className="generator-localisation">
            {project.contractor_address ?? '-'}
          </p>
        </div>
        <div className="flex align-center mb-2">
          <AlternateEmailOutlinedIcon className="mr-2" />
          <p className="generator-localisation">{project.email ?? '-'}</p>
        </div>
        <div className="flex align-center mb-2">
          <CallOutlinedIcon className="mr-2" />
          <p className="generator-localisation">{project.mobile ?? '-'}</p>
        </div>
      </div>
    </div>
  );
}
