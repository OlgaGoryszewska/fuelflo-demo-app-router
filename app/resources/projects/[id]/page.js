'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ChevronDown } from 'lucide-react';
import avatar from '@/public/avatar.png';

import Image from 'next/image';
import banner from '@/public/banner.jpg';
import Link from 'next/link';
import formatDate from '@/components/FormatDate';
import ProjectFuelTransactionList from '@/components/ProjectFuelTransactionList';

// icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';

export default function ProjectDetailPage() {
  const { id: projectId } = useParams();

  const [openCard, setOpenCard] = useState(null);
  const [project, setProject] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [fleetRows, setFleetRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toggleCard = (cardName) => {
    setOpenCard((prev) => (prev === cardName ? null : cardName));
  };

  useEffect(() => {
    if (!projectId) return;

    async function loadProjectDetails() {
      setLoading(true);
      setError('');

      const idValue = isNaN(Number(projectId)) ? projectId : Number(projectId);

      try {
        // 1. Project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(
            `
            id,
            name,
            location,
            start_date,
            end_date,
            contractor_name,
            contractor_address,
            email,
            mobile,
            amount,
            selling_price,
            specification,
            additional,
            company_name,
            expected_liters,
            active,
            manager_id,
            manager:profiles!projects_manager_id_fkey (
                  id,
                  full_name,
                   role,
                   email,
                  phone)
          `
          )
          .eq('id', idValue)
          .single();

        if (projectError) throw projectError;

        // 2. Assigned technicians
        const { data: technicianRelations, error: techniciansError } =
          await supabase
            .from('profiles_projects')
            .select(
              `
              profiles_id,
              profiles:profiles_projects_profiles_id_fkey (
                id,
                full_name,
                role,
                email,
                phone
              )
            `
            )
            .eq('projects_id', idValue);

        if (techniciansError) throw techniciansError;

        // 3. Generators and tanks
        const { data: fleetData, error: fleetError } = await supabase
          .from('generators_tanks')
          .select(
            `
            id,
            project_id,
            generator_id,
            generator_name,
            tank_id,
            tank_name
          `
          )
          .eq('project_id', idValue);

        if (fleetError) throw fleetError;

        setProject(projectData);
        setTechnicians(
          (technicianRelations || [])
            .map((item) => item.profiles)
            .filter(Boolean)
        );
        setFleetRows(fleetData || []);
      } catch (err) {
        console.error('Error loading project details:', err);
        setError(err.message || 'Failed to load project details');
        setProject(null);
        setTechnicians([]);
        setFleetRows([]);
      } finally {
        setLoading(false);
      }
    }

    loadProjectDetails();
  }, [projectId]);

  const fleet = useMemo(() => {
    const grouped = {};

    for (const row of fleetRows) {
      const key = String(row.generator_id);

      if (!grouped[key]) {
        grouped[key] = {
          id: row.generator_id,
          name: row.generator_name,
          tanks: [],
        };
      }

      if (row.tank_id || row.tank_name) {
        grouped[key].tanks.push({
          id: row.tank_id,
          name: row.tank_name,
        });
      }
    }

    return Object.values(grouped);
  }, [fleetRows]);

  const purchasePrice = Number(project?.amount ?? 0);
  const sellingPrice = Number(project?.selling_price ?? 0);
  const marginPerLiter = sellingPrice - purchasePrice;
  const expectedLiters = Number(project?.expected_liters ?? 0);
  const expectedEarnings =
    expectedLiters > 0 ? expectedLiters * marginPerLiter : null;

  if (loading) {
    return (
      <div className="main-container">
        <div className="background-container">Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-container">
        <div className="background-container">Error: {error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="main-container">
        <div className="background-container">Project not found.</div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="background-container-white mb-4">
        <div className="flex flex-row justify-between items-center mt-2">
          {' '}
          <h2 className="">Project Details</h2>
          <div className="mt-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                project.active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {project.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <h4 className="h-mid-gray-s">{project.name || '-'}</h4>

        {project.location && (
          <div className="h-54 w-full mb-4">
            <iframe
              title="Project location map"
              className="h-full w-full rounded-lg border-0"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                project.location
              )}&output=embed`}
              allowFullScreen
            />
          </div>
        )}

        <div className="flex items-start mb-4">
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
          <div className="container-flex">
            <h4>Starting date</h4>
            <p className="steps-text">
              {project.start_date ? formatDate(project.start_date) : '-'}
            </p>
          </div>

          <div className="container-flex">
            <h4>End date</h4>
            <p className="steps-text">
              {project.end_date ? formatDate(project.end_date) : '-'}
            </p>
          </div>
        </div>

        <p className="steps-text mt-4">Assigned to the project</p>
        <div className="container-flex">
          <div className="flex flex-col justify-between items-center">
            <Image src={avatar} alt="avatar" className="avatar" />
            <p className="steps-text">Manager</p>
            <p className="h-mid-gray-s">
              {project.manager?.full_name || 'No manager assigned'}
            </p>
          </div>
        </div>

        <div
          onClick={() => toggleCard('technicians')}
          className="mt-4 flex flex-row items-center border-b border-b-gray-200 pb-2"
        >
          <p className="h-mid-gray-s">Technicians</p>
          <ChevronDown
            className={`ml-auto text-gray-400 transition-transform ${
              openCard === 'technicians' ? 'rotate-180' : ''
            }`}
          />
        </div>

        {openCard === 'technicians' && (
          <div>
            {technicians.length > 0 ? (
              technicians.map((tech) => (
                <div
                  key={tech.id}
                  className="mt-2 flex flex-row items-center border-b border-b-gray-200 pb-2"
                >
                  <div>
                    <p>{tech.full_name || 'Unnamed technician'}</p>
                    {tech.role && <p className="steps-text ">{tech.role}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p>No technicians assigned.</p>
            )}
          </div>
        )}
        <div
          onClick={() => toggleCard('generators')}
          className="mt-2 flex flex-row items-center border-b border-b-gray-200 pb-2"
        >
          <p className="h-mid-gray-s">Generators</p>
          <ChevronDown
            className={`ml-auto text-gray-400 transition-transform ${
              openCard === 'generators' ? 'rotate-180' : ''
            }`}
          />
        </div>

        {openCard === 'generators' && (
          <div className="">
            {fleet.length > 0 ? (
              fleet.map((generator) => (
                <div key={generator.id} className="w-full">
                  <div className="flex items-center gap-2">
                    <h4>{generator.name}</h4>
                  </div>

                  {(generator.tanks || []).length > 0 ? (
                    <ul className="steps-text mb-2">
                      {generator.tanks.map((tank) => (
                        <li key={`${generator.id}-${tank.id || tank.name}`}>
                          {tank.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-8 steps-text">No tanks assigned.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No generators connected.</p>
            )}
          </div>
        )}

        <div
          onClick={() => toggleCard('tanks')}
          className="mt-2 flex flex-row items-center border-b border-b-gray-200 pb-2"
        >
          <p className="h-mid-gray-s">External tanks</p>
          <ChevronDown
            className={`ml-auto text-gray-400 transition-transform ${
              openCard === 'tanks' ? 'rotate-180' : ''
            }`}
          />
        </div>

        {openCard === 'tanks' && (
          <div>
            {fleetRows.length > 0 ? (
              fleetRows.map((row) => (
                <div key={row.id}>
                  <p className="steps-text mt-2 flex flex-row items-center border-b border-b-gray-200 pb-2">
                    {row.tank_name || 'Unnamed tank'} (
                    {row.generator_name || 'Unknown generator'})
                  </p>
                </div>
              ))
            ) : (
              <p>No external tanks connected.</p>
            )}
          </div>
        )}

        <button className="button-white mt-2 mb-2">
          <Link href={`/resources/projects/${projectId}/edit`}>Edit</Link>
        </button>
      </div>

      <ProjectFuelTransactionList projectId={projectId} />

      <div className="background-container mb-4">
        <h2>Fuel Financials</h2>
        <p className="steps-text">Live pricing & margin intelligence</p>

        <div className="gen-grid pb-4">
          <div className="project-inf-box">
            <h4 className="box-text">Purchase Price</h4>
            <p className="box-insert">{purchasePrice.toFixed(2)} SAR/L</p>
          </div>

          <div className="project-inf-box">
            <h4 className="box-text">Selling Price</h4>
            <p className="box-insert">{sellingPrice.toFixed(2)} SAR/L</p>
          </div>

          <div className="project-inf-box-green">
            <h4 className="box-text">Margin</h4>
            <p className="box-insert">{marginPerLiter.toFixed(2)} SAR/L</p>
          </div>

          <div className="project-inf-box-green">
            <h4 className="box-text">Expected Earnings</h4>
            <p className="box-insert">
              {expectedEarnings !== null
                ? `${expectedEarnings.toFixed(2)} SAR`
                : 'Add expected liters to calculate'}
            </p>
          </div>
        </div>
      </div>

      <div className="background-container mb-4">
        <h2>Contact to Partners</h2>

        <div className="flex flex-col items-center justify-center">
          <Image src={banner} alt="banner" className="banner-tin" />
          <h2 className="h-mid-gray-s">{project.contractor_name ?? '-'}</h2>
          <h4>Event organizer</h4>
        </div>

        <div className="mb-2 flex align-center">
          <ApartmentOutlinedIcon className="gray-icon mr-2" />
          <p className="steps-text">{project.company_name ?? '-'}</p>
        </div>

        <div className="mb-2 flex align-center">
          <LocationOnOutlinedIcon className="gray-icon mr-2" />
          <p className="steps-text">{project.contractor_address ?? '-'}</p>
        </div>

        <div className="mb-2 flex align-center">
          <AlternateEmailOutlinedIcon className="gray-icon mr-2" />
          <p className="steps-text">{project.email ?? '-'}</p>
        </div>

        <div className="mb-2 flex align-center">
          <CallOutlinedIcon className="gray-icon mr-2" />
          <p className="steps-text">{project.mobile ?? '-'}</p>
        </div>
        <div className="flex items-center justify-between">
          <div></div>
        </div>
      </div>
    </div>
  );
}
