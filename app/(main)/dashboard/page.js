'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from "lucide-react";




export default function Dashboard() {
  const [openCard, setOpenCard] = useState(false);
  return (
    <div>
      <div className="m-2.5">
        <div 
        onClick={() => setOpenCard(!openCard)} 
        className={`form-button ${openCard ? 'border-active' : ''}`}>
          <span className="material-symbols-outlined">tactic</span>
          Projects<ChevronDown className={`ml-auto transition-transform ${openCard ? 'rotate-180' : ''}`} />
        </div>
        {openCard && (<div className="open-card ">
          
          <Link href="/add-new-project" className="card-button">
            <span className="material-symbols-outlined">add</span>
            Add new Project
          </Link>
          <Link href="/ongoing-projects-page" className="card-button">
            <span className="material-symbols-outlined">workspaces</span>
            Ongoing Projects
          </Link>
          <Link href="/" className="card-button">
            <span className="material-symbols-outlined">archive</span>
            Archive
          </Link>
        </div>)}
      










      
        <Link href="/projects/" className="form-button">
          <span className="material-symbols-outlined">engineering</span>
          Technicians
        </Link>
        <Link href="/projects/" className="form-button">
          <span className="material-symbols-outlined">group</span>
          Customers
        </Link>
        <Link href="/generators" className="form-button">
          <span class="material-symbols-outlined">gas_meter</span>
          Generators
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
