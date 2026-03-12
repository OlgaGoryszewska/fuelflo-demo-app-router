'use client';
import Link from 'next/link';
import { useState } from 'react';

import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import PropaneTankOutlinedIcon from '@mui/icons-material/PropaneTankOutlined';
import QrCodeOutlinedIcon from '@mui/icons-material/QrCodeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import ElectricRickshawOutlinedIcon from '@mui/icons-material/ElectricRickshawOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

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
          <AccountTreeOutlinedIcon className="mp-4" />
          Projects{' '}
          <KeyboardArrowDownOutlinedIcon
            className={` ml-auto transition-transform text-gray-400 ${openCard === 'projects' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'projects' && (
          <div className="open-card ">
            <Link
              href="/resources/ongoing-projects-page"
              className="card-button"
            >
              <RouteOutlinedIcon />
              Ongoing Projects
            </Link>
            <Link href="/" className="card-button">
              <ArchiveOutlinedIcon />
              Archive
            </Link>
            <Link href="/add-forms/add-new-project" className="card-button">
              <AddOutlinedIcon />
              Add new Project
            </Link>
          </div>
        )}

        <div
          onClick={() => toggleCard('transactions')}
          className={`form-button ${openCard === 'transactions' ? 'border-active' : ''}`}
        >
          <CachedIcon /> Transactions{' '}
          <KeyboardArrowDownOutlinedIcon
            className={` ml-auto transition-transform text-gray-400 ${openCard === 'transactions' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'transactions' && (
          <div className="open-card ">
            <Link
              href="/resources/transactions/deliveries"
              className="card-button"
            >
              <ElectricRickshawOutlinedIcon />
              Deliveries
            </Link>
            <Link
              href="/resources/transactions/returns"
              className="card-button"
            >
              <UndoOutlinedIcon />
              Returns
            </Link>
            <Link href="/resources/transactions/new" className="card-button">
              <AddOutlinedIcon />
              Add New Transaction
            </Link>
          </div>
        )}

        <div
          onClick={() => toggleCard('technicians')}
          className={`form-button ${openCard === 'technicians' ? 'border-active' : ''}`}
        >
          <PeopleOutlineOutlinedIcon />
          Personel{' '}
          <KeyboardArrowDownOutlinedIcon
            className={` ml-auto transition-transform text-gray-400 ${openCard === 'technicians' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'technicians' && (
          <div className="open-card ">
            <Link href="/ongoing-technicians-page" className="card-button">
              <EngineeringOutlinedIcon />
              Managers
            </Link>
            <Link href="/ongoing-technicians-page" className="card-button">
              <EngineeringOutlinedIcon />
              Technicians
            </Link>
            <Link href="/ongoing-technicians-page" className="card-button">
              <ManageAccountsOutlinedIcon />
              Hire Desk Coordinator
            </Link>
            <Link href="/add-forms/add-generator" className="card-button">
              <AddOutlinedIcon />
              Add Personel
            </Link>
          </div>
        )}
        <div
          onClick={() => toggleCard('external partners')}
          className={`form-button  ${openCard === 'external partners' ? 'border-active' : ''}`}
        >
          <GroupsOutlinedIcon />
          External Partners
          <KeyboardArrowDownOutlinedIcon
            className={` ml-auto transition-transform text-gray-400 ${openCard === 'external partners' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'external partners' && (
          <div className="open-card ">
            <Link href="/resources/event_organizers/" className="card-button">
              <Person4OutlinedIcon />
              Event Organizers
            </Link>
            <Link href="/resources/event_organizers/" className="card-button">
              <Person4OutlinedIcon />
              Fuel Suppliers
            </Link>
            <Link href="/add-forms/add-generator" className="card-button">
              <AddOutlinedIcon />
              Add Partner
            </Link>
          </div>
        )}
        <div
          onClick={() => toggleCard('equipment')}
          className={`form-button  ${openCard === 'equipment' ? 'border-active' : ''}`}
        >
          <BoltOutlinedIcon />
          Equipment{' '}
          <KeyboardArrowDownOutlinedIcon
            className={` ml-auto transition-transform text-gray-400 ${openCard === 'external tank' ? 'rotate-180' : ''}`}
          />
        </div>
        {openCard === 'equipment' && (
          <div className="open-card ">
            <Link href="/resources/generators" className="card-button">
              <BoltOutlinedIcon />
              Generators
            </Link>
            <Link href="/resources/external-tanks" className="card-button">
              <PropaneTankOutlinedIcon />
              External Tanks
            </Link>
            <Link href="/add-forms/add-generator" className="card-button">
              <AddOutlinedIcon />
              Add new Equipment
            </Link>
          </div>
        )}

        <Link href="/operations/create-qr-code" className="form-button mt-4">
          <QrCodeOutlinedIcon />
          Create a new QR Code
        </Link>
        <Link href="/not-found" className="form-button">
          <AssessmentOutlinedIcon />
          Reports
        </Link>
        <Link
          className="form-button-orange"
          href={`/resources/transactions/new/`}
        >
          <AddOutlinedIcon />
          Add Fuel Delivery
        </Link>
      </div>
    </div>
  );
}
