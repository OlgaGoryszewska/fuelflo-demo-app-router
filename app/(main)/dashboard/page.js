'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const [openCard, setOpenCard] = useState(null);

  const toggleCard = (cardName) => {
    setOpenCard((prev) => (prev === cardName ? null : cardName));
  };

  return (
    <div>
      <div className="m-2.5">
        <div className="form-header mb-4">
          <h1 className="ml-2">dashboard</h1>
        </div>
        <div
          onClick={() => toggleCard('projects')}
          className={`form-button ${openCard === 'projects' ? 'border-active' : ''}`}
        >
          <span className="material-symbols-outlined">tactic</span>
          Projects{' '}
          <ChevronDown
            className={`ml-auto transition-transform text-gray-400 ${openCard === 'projects' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'projects' && (
          <div className="open-card ">
            <Link href="/ongoing-projects-page" className="card-button">
              <span className="material-symbols-outlined">workspaces</span>
              Ongoing Projects
            </Link>
            <Link href="/" className="card-button">
              <span className="material-symbols-outlined">archive</span>
              Archive
            </Link>
            <Link href="/add-new-project" className="card-button">
              <span className="material-symbols-outlined">add</span>
              Add new Project
            </Link>
          </div>
        )}

        <div
          onClick={() => toggleCard('technicians')}
          className={`form-button ${openCard === 'technicians' ? 'border-active' : ''}`}
        >
          <span className="material-symbols-outlined">communities</span>
          Personel{' '}
          <ChevronDown
            className={`ml-auto transition-transform text-gray-400 ${openCard === 'technicians' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'technicians' && (
          <div className="open-card ">
            <Link href="/ongoing-technicians-page" className="card-button">
              <span className="material-symbols-outlined">workspaces</span>
              Managers
            </Link>
            <Link href="/ongoing-technicians-page" className="card-button">
              <span className="material-symbols-outlined">workspaces</span>
              Technicians
            </Link>
            <Link href="/ongoing-technicians-page" className="card-button">
              <span className="material-symbols-outlined">workspaces</span>
              Hire Desk Coordinator
            </Link>
            <Link href="/add-new-technician" className="card-button">
              <span className="material-symbols-outlined">add</span>
              Add new Personel
            </Link>
          </div>
        )}
        <div
          onClick={() => toggleCard('external partners')}
          className={`form-button  ${openCard === 'external partners' ? 'border-active' : ''}`}
        >
          <span className="material-symbols-outlined">handshake</span>External
          Partners
          <ChevronDown
            className={`ml-auto transition-transform text-gray-400 ${openCard === 'texternal partners' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'external partners' && (<div className="open-card ">
          <Link href="/ongoing-external-partners-page" className="card-button">
            <span className="material-symbols-outlined">festival</span>
            Evetns Organizers
          </Link>
          <Link href="/ongoing-external-partners-page" className="card-button">
            <span className="material-symbols-outlined">delivery_truck_bolt</span>
           Fuel Suppliers
          </Link>
          <Link href="/add-new-external-partner" className="card-button">
            <span className="material-symbols-outlined">add</span>
            Add new Partner
          </Link>
        </div>)}

        <Link href="/generators" className="form-button">
          <span className="material-symbols-outlined">gas_meter</span>
          Equipment
        </Link>
        <Link href="/projects/" className="form-button">
          <span className="material-symbols-outlined">add</span>
          Register a new User
        </Link>
        <Link href="/projects/" className="form-button">
          <span className="material-symbols-outlined">analytics</span>
          Reports
        </Link>
      </div>
    </div>
  );
}
