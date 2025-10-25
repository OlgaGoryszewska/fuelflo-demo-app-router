
// app/generators/page.jsx (Server Component)
//import { createClient } from '@/lib/supabase/server';



//export default async function GeneratorsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('generators')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    // Only log simple strings
    return <p className="text-red-600">Error: {error.message}</p>;
  }

  // Safe log: number only


  if (!data || data.length === 0) return <p>No generators found.</p>;

  return (
    
    <div className="m-2.5">
      <div className="form-header mb-4">
        <span className="material-symbols-outlined big">bolt</span>
        <h1 className="ml-2">Generators</h1>
      </div>
      <div style={{ padding: 20 }}>
      <h1>Generators</h1>
      <ul>
        {data.map((g) => (
          <li key={g.id}>
            {g.name || 'Untitled'} — {g.serial || 'no serial'}
          </li>
        ))}
      </ul>
    </div>

      <label htmlFor="search">
        Search by name or ID
        <input
          id="search"
          type="text"
          placeholder="Search Generators..."
          className="mb-4"
        />
      </label>

      <div className="background-container mb-4">
        <div className="form-header mb-4">
          <span className="material-symbols-outlined">bolt</span>
          <h3 className="ml-2">{g.name}</h3>
        </div>
      </div>

      <Link href="/add-generator/" className="form-button">
        <span className="material-symbols-outlined">add</span>
        Add Generator
      </Link>

      <div className="form-header mb-4 mt-6">
        <span className="material-symbols-outlined big">gas_meter</span>
        <h1 className="ml-2">External Tanks</h1>
      </div>

      <label htmlFor="search-tanks">
        Search by name or ID
        <input
          id="search-tanks"
          type="text"
          placeholder="Search Tanks..."
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
