import Link from 'next/link';
import { MdAdd } from 'react-icons/md';

export default function AddNewProjectButton() {
  return (
    <div>
      <Link href="/projects/" className="form-button">
        {' '}
        <MdAdd className="button-icon" />
        Add New Project
      </Link>
    </div>
  );
}
