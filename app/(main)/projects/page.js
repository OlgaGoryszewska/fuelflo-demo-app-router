import Link from 'next/link';

export default function Projects() {
  return (
    <div>
      <div className="main-container">
        <div className="background-container">
          <div className="dashed-line">
            <span className="material-symbols-outlined">tactic</span>
            <h1>Projects</h1>
          </div>
          <Link href="/add-new-project" className="form-button">
            <span class="material-symbols-outlined">add</span>
            Add new Project
          </Link>
          <Link href="/add-new-project" className="form-button">
            <span class="material-symbols-outlined">add</span>
            Add new Project
          </Link>
        </div>
      </div>
    </div>
  );
}
