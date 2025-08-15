import { supabase } from '@/lib/SupabaseClient';

export default async function ProjectPage({ params }) {
  const { id } = params;

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  if (!data) {
    return <div className="p-6">Project not found</div>;
  }

  const p = data;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">{p.name}</h1>
      <p>
        <b>Location:</b> {p.location}
      </p>
      <p>
        <b>Release Date:</b> {p.releaseDate}
      </p>
      <p>
        <b>End Date:</b> {p.endDate}
      </p>
      <p>
        <b>Contractor Name:</b> {p.contractor_name}
      </p>
      <p>
        <b>Contractor Address:</b> {p.contractor_address}
      </p>
      <p>
        <b>Email:</b> {p.email}
      </p>
      <p>
        <b>Mobile:</b> {p.mobile}
      </p>
      <p>
        <b>Technician:</b> {p.technician}
      </p>
      <p>
        <b>Generator:</b> {p.generator}
      </p>
      <p>
        <b>Tank:</b> {p.tank}
      </p>
      <p>
        <b>Purchase Price:</b> {p.amount}
      </p>
      <p>
        <b>Selling Price:</b> {p.selling_price}
      </p>
      <p>
        <b>Specification:</b> {p.specification}
      </p>
      <p>
        <b>Additional Notes:</b> {p.additional}
      </p>
    </div>
  );
}
