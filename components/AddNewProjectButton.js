import Link from 'next/link';

export default function AddNewProjectButton() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Link
        href="/projects/"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create New Project
      </Link>
    </div>
  );
}
