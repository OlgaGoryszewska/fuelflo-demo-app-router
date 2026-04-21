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
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setError(null);
      setLoading(true);

      // 1. Load technician
      const { data: technicianData, error: technicianError } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, role, address')
        .eq('id', id)
        .maybeSingle();

      if (technicianError) {
        setError(technicianError.message);
        setTechnician(null);
        setAssignedProjects([]);
        setLoading(false);
        return;
      }

      setTechnician(technicianData);

      // 2. Load assigned projects through join table
      const { data: projectsData, error: projectsError } = await supabase
        .from('profiles_projects')
        .select(
          `
          id,
          projects:projects_id (
            *
          )
        `
        )
        .eq('profiles_id', id);

      if (projectsError) {
        setError(projectsError.message);
        setAssignedProjects([]);
        setLoading(false);
        return;
      }

      // flatten nested projects
      const projectList =
        projectsData?.map((item) => item.projects).filter(Boolean) || [];

      setAssignedProjects(projectList);
      setLoading(false);
    }

    load();
  }, [id]);

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

  if (!technician) {
    return (
      <div className="main-container">
        <div className="background-container">Personel not found.</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="ml-2 mt-2 hidden">Technician page</h1>

      <div>
        <div className="banner">
          <Image src={banner} alt="banner" className="banner" />
          <Image className="avatar-big" src={avatar} alt="avatar img" />
        </div>

        <div className="main-container">
          <h2 className="m-auto mt-10">{technician.full_name}</h2>

          <div className="background-container mt-2">
            <p className="h-mid-gray-s">Contact</p>
            <p className="steps-text">{technician.phone}</p>
            <p className="steps-text">{technician.email}</p>

            <div className="divider-full"></div>

            <p className="h-mid-gray-s">Role</p>
            <p className="steps-text">{technician.role}</p>

            <div className="divider-full"></div>

            <p className="h-mid-gray-s">Address</p>
            <p className="steps-text">{technician.address}</p>
          </div>

          <div className="background-container-white mt-2">
            <h2>Assigned projects</h2>

            {assignedProjects.length === 0 ? (
              <p className="steps-text mt-2">No assigned projects.</p>
            ) : (
              <div className="mt-2">
                {assignedProjects.map((project) => (
                  <div key={project.id} className="background-container mt-2">
                    <p className="steps-text">
                      {project.name ||
                        project.project_name ||
                        project.title ||
                        'Untitled project'}
                    </p>

                    {project.description && (
                      <p className="steps-text">{project.description}</p>
                    )}

                    {project.location && (
                      <p className="steps-text">{project.location}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
