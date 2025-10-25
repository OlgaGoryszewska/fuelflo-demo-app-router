// app/generators/page.jsx
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function GeneratorsPage() {
  const supabase = await createClient();

  // Fetch generators from database
  const { data, error } = await supabase.from('generators').select('*');

  if (error) {
    return <p>Error loading generators: {error.message}</p>;
  }

  return (
    <div className="m-2.5">
      <div className="form-header mb-4">
        <span className="material-symbols-outlined big">bolt</span>
        <h1 className="ml-2">Generators</h1>
      </div>

      {data && data.length > 0 ? (
        <div>
          {data.map((generator) => (
            <div className="background-container mb-4" key={generator.id}>
              <div className="form-header mb-4">
                <span className="material-symbols-outlined">bolt</span>
                <h3 className="ml-2">{generator.name}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No generators found.</p>
      )}
    </div>
  );
}
