import Link from 'next/link';

export default function ongoingProjects() {
  return (
    <div>
      <div className="main-container">
        <div className="background-container">
          <div className="dashed-line">
            <span className="material-symbols-outlined">workspaces</span>
            <h1>Ongoing Porjects</h1>
          </div>
          <Link href="/ongoing-projects-page" className="card-button">
            <span class="material-symbols-outlined">workspaces</span>
            Ongoing Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
