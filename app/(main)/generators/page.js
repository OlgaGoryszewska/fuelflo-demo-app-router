import Link from 'next/link';

export default function Generators() {
  return (
    <div className="m-2.5">
      <form className="p-4">
        <h3 className="mb-4">Generators</h3>
        <Link href="/add-generator/" className="form-button">
          <span className="material-symbols-outlined">add</span>
          Add Generator
        </Link>
        <h3 className="mb-4">External Tanks</h3>
        <Link href="/add-generator/" className="form-button">
          <span className="material-symbols-outlined">add</span>
          Add Tank
        </Link>
      </form>
    </div>
  );
}
