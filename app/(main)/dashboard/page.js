import Link from 'next/link';

export default function Dashboard() {
  return (
    <div>
      <div className="m-2.5">
        <Link href="/projects/" className="form-button">
          <span className="material-symbols-outlined">tactic</span>
          Projects
        </Link>
        <Link href="/projects/" className="form-button">
          <span className="material-symbols-outlined">engineering</span>
          Technicians
        </Link>
        <Link href="/projects/" className="form-button">
          <span className="material-symbols-outlined">group</span>
          Customers
        </Link>
        <Link href="/projects/" className="form-button">
          <span className="material-symbols-outlined">battery_charging_80</span>
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
