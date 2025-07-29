
import Link from 'next/link';
import { MdAdd } from 'react-icons/md';

export default function Dashboard() {
  return (
    <div>
      
      <div>
        <Link href="/projects/" className="form-button">
          {' '}
          <MdAdd className="button-icon" />
         Projects
        </Link>
      </div>
    </div>
  );
}
