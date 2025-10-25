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
    <div style={{ padding: 20 }}>
      <h1>Generators</h1>

      {data && data.length > 0 ? (
        <ul>
          {data.map((generator) => (
            <li key={generator.id}>{generator.name}</li>
          ))}
        </ul>
      ) : (
        <p>No generators found.</p>
      )}
    </div>
  );
}
