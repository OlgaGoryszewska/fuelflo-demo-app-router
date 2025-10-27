import Link from 'next/link';

export default function Projects() {
  return (
    <div>
      <div className="main-container">
      <div className="form-header mb-4">
            <span className="material-symbols-outlined big">tactic</span>
            <h1 className="ml-2">Projects</h1>
          </div>
        <div className="flex flex-col gap-2">
          
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
        </div>
      </div>
    </div>
  );
}
