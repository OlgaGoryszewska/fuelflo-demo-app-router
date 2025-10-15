import Link from 'next/link';

export default function Generators() {
  return (
    <div className="m-2.5">
      <div className="form-header mb-4">
        <span class="material-symbols-outlined big ">bolt</span>
        <h1 className="ml-2">Generators</h1>
      </div>

      <label className="" htmlFor="search">
        Search by name or ID
        <input
          type="text"
          placeholder="Search Generators..."
          className="mb-4"
        />
      </label>
      <div className="background-container mb-4">
      <div className="form-header mb-4">
        <span class="material-symbols-outlined ">bolt</span>
        <h3 className="ml-2">Text</h3>
      </div>
        
      </div>

      <Link href="/add-generator/" className="form-button">
        <span className="material-symbols-outlined">add</span>
        Add Generator
      </Link>
      <div className="form-header mb-4">
        <span class="material-symbols-outlined big ">gas_meter</span>
        <h1 className="ml-2">External Tanks</h1>
      </div>
      <label className="" htmlFor="search">
        Search by name or ID
        <input
          type="text"
          placeholder="Search Generators..."
          className="mb-4"
        />
      </label>
    

      <Link href="/add-generator/" className="form-button">
        <span className="material-symbols-outlined">add</span>
        Add Tank
      </Link>
    </div>
  );
}
