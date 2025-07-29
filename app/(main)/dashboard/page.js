import Link from 'next/link';

export default function Dashboard() {
  return (
    <div>
      <div>
        <Link href="/projects/" className="form-button">
          <span className="material-symbols-outlined">tactic</span>
          Projects
        </Link>
      </div>
    </div>
  );
}
