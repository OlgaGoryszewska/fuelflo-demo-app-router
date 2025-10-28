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
        <h1 className="ml-2">Generators</h1>
      </div>

      {data && data.length > 0 ? (
        <div>
          {data.map((generator) => (
            <div className="generator-container mb-4" key={generator.id}>
              <div className="form-header mb-4">
                <span className="material-symbols-outlined">bolt</span>
                <h3 className="ml-2 uppercase">{generator.name}</h3>
              </div>
              <div className="flex items-start mb-2">
                <span className="material-symbols-outlined tin ">
                  location_on
                </span>
                <p className="generator-localisation">
                  {' '}
                  {generator.localisation}
                </p>
              </div>
              <p className="pt-4">Generator fuel</p>
              <div className="fuel-bar"></div>
              <p className="generator-localisation text-right">100%</p>
              <div className="gen-grid">
                <div className="generator-inf-box">
                  <p className="box-text">Tank Capacity</p>
                  <p className="box-insert">{generator.fuel_capacity} L</p>
                </div>
                <div className="generator-inf-box">
                  <p className="box-text">Consumption 100% load</p>
                  <p className="box-insert">
                    {generator.fuel_consumption_100} L/H
                  </p>
                </div>
                <div className="generator-inf-box">
                  <p className="box-text">Run on full load</p>
                  <p className="box-insert">{generator.run_hours_100_load} H</p>
                </div>
              </div>
              <p className="pt-4">External Tanks</p>
              <div className="flex p-3 items-center rounded-2xl bg-white shadow">
                <span className="material-symbols-outlined">gas_meter</span>

                <p>
                  {generator.external_tank
                    ? generator.external_tank
                    : 'No external tanks connected.'}
                </p>
              </div>
              <div className="gen-grid">
                <div className="generator-inf-box">
                  <p className="box-text">Model No</p>
                  <p className="box-insert">{generator.model_no}</p>
                </div>
                <div className="generator-inf-box">
                  <p className="box-text">Fleet No</p>
                  <p className="box-insert">{generator.fleet_no}</p>
                </div>
                <div className="generator-inf-box">
                  <p className="box-text">Prime power</p>
                  <p className="box-insert">{generator.prime_power} kVA/kW</p>
                </div>
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
