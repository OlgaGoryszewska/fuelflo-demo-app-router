import Link from 'next/link';

export default function Generators() {
  return (
    <div className="m-2.5">
      <Link href="/add-generator/" className="form-button">
        <span className="material-symbols-outlined">add</span>
        Add Generator
      </Link>
    </div>
  );
}
