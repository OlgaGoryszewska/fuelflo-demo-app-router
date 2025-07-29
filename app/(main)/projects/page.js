import Link from 'next/link';

export default function Projects() {
  return (
    <div>
      <img src="/baner.png" alt="main page baner" className="pb-4" />
      <div className="background-container">
        <div className="dashed-line">
          <span className="material-symbols-outlined">tactic</span>
          <h1>Projects</h1>
        </div>
        <Link href="/add-new-project" className="form-button">
          <span class="material-symbols-outlined">add</span>
          Add new Project
        </Link>
      </div>
    </div>
  );
}
