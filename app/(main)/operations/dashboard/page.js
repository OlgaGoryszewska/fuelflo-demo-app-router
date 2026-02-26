'use client';
import Link from 'next/link';
import { useState } from 'react';

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
          <span className={`material-symbols-outlined ml-auto transition-transform text-gray-400 ${openCard === 'projects' ? 'rotate-180' : ''}`}>
          keyboard_arrow_down
          </span>
           
        </div>
        {openCard === 'projects' && (
          <div className="open-card ">
            <Link href="/resources/ongoing-projects-page" className="card-button">
              <span className="material-symbols-outlined">workspaces</span>
              Ongoing Projects
            </Link>
            <Link href="/" className="card-button">
              <span className="material-symbols-outlined">archive</span>
              Archive
            </Link>
            <Link href="/add-forms/add-new-project" className="card-button">
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
          <span className={`material-symbols-outlined ml-auto transition-transform text-gray-400 ${openCard === 'technicians' ? 'rotate-180' : ''}`}>
          keyboard_arrow_down
          </span>
        </div>
        {openCard === 'technicians' && (
          <div className="open-card ">
            <Link href="/ongoing-technicians-page" className="card-button">
              <span className="material-symbols-outlined">groups_3</span>
              Managers
            </Link>
            <Link href="/ongoing-technicians-page" className="card-button">
              <span className="material-symbols-outlined">person_apron</span>
              Technicians
            </Link>
            <Link href="/ongoing-technicians-page" className="card-button">
              <span className="material-symbols-outlined">
                supervisor_account
              </span>
              Hire Desk Coordinator
            </Link>
          </div>
        )}
        <div
          onClick={() => toggleCard('external partners')}
          className={`form-button  ${openCard === 'external partners' ? 'border-active' : ''}`}
        >
          <span className="material-symbols-outlined">handshake</span>External
          Partners
          <span className={`material-symbols-outlined ml-auto transition-transform text-gray-400 ${openCard === 'external partners' ? 'rotate-180' : ''}`}>
          keyboard_arrow_down
          </span>
        </div>
        {openCard === 'external partners' && (
          <div className="open-card ">
            <Link href="/resources/event_organizers/" className="card-button">
              <span className="material-symbols-outlined">festival</span>
              Event Organizers
            </Link>
            <Link href="/resources/event_organizers/" className="card-button">
              <span className="material-symbols-outlined">
                delivery_truck_bolt
              </span>
              Fuel Suppliers
            </Link>
          </div>
        )}
        <div
          onClick={() => toggleCard('equipment')}
          className={`form-button  ${openCard === 'equipment' ? 'border-active' : ''}`}
        >
          <span className="material-symbols-outlined">gas_meter</span>
          Equipment{' '}
          <span className={`material-symbols-outlined ml-auto transition-transform text-gray-400 ${openCard === 'external partners' ? 'rotate-180' : ''}`}>
          keyboard_arrow_down
          </span>
        </div>
        {openCard === 'equipment' && (
          <div className="open-card ">
            <Link href="/resources/generators" className="card-button">
              <span className="material-symbols-outlined">ev_station</span>
              Generators
            </Link>
            <Link href="/resources/external-tanks" className="card-button">
              <span className="material-symbols-outlined">gas_meter</span>
              External Tanks
            </Link>
            <Link href="/add-forms/add-generator" className="card-button">
              <span className="material-symbols-outlined">add</span>
              Add new Equipment
            </Link>
          </div>
        )}

        <Link href="/add_new_user" className="form-button mt-4">
          <span className="material-symbols-outlined">add</span>
          Register a new User
        </Link>
        <Link href="/create-qr-code" className="form-button">
          <span className="material-symbols-outlined">qr_code</span>
          Create a new QR Code
        </Link>
        <Link href="/not-found" className="form-button">
          <span className="material-symbols-outlined">analytics</span>
          Reports
        </Link>
      </div>
    </div>
  );
}
