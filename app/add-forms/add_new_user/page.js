import Link from 'next/link';

export default function AddNewUser() {
  return (
    <div className="m-2.5">
      <div className="form-header mb-4">
        <h1 className="ml-2">add new user</h1>
      </div>
      <div className="flex flex-col gap-2">
        <Link href="/add-event-organizer" className="card-button gap-2 ">
          <span className="material-symbols-outlined">festival</span>
          Event Organizer
        </Link>
        <Link href="/add-fuel-supplier" className="card-button">
          <span className="material-symbols-outlined">delivery_truck_bolt</span>
          Fuel Supplier
        </Link>
        <Link href="/not-found" className="card-button">
          <span className="material-symbols-outlined">groups_3</span>
          Manager
        </Link>
        <Link href="/not_found" className="card-button">
          <span className="material-symbols-outlined">person_apron</span>
          Technician
        </Link>
        <Link href="/not-found" className="card-button">
          <span className="material-symbols-outlined">supervisor_account</span>
          Hire Desk Coordinator
        </Link>
      </div>
    </div>
  );
}
