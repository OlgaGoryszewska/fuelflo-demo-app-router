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
          <Link href="/add-new-project" className="card-button">
            <span class="material-symbols-outlined">add</span>
            Add new Project
          </Link>
          <Link href="/ongoing-projects-page" className="card-button">
            <span class="material-symbols-outlined">workspaces</span>
            Ongoing Projects
          </Link>
          <Link href="/" className="card-button">
            <span class="material-symbols-outlined">archive</span>
            Archive
          </Link>
        </div>
      </div>
    </div>
  );
}
