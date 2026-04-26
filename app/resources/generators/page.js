// app/generators/page.jsx
import { createClient } from '@/lib/supabase/server';

//icons
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import OilBarrelOutlinedIcon from '@mui/icons-material/OilBarrelOutlined';

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
      <div className="form-header">
        <h1 className="ml-2">Generators</h1>
      </div>

      {data && data.length > 0 ? (
        <div>
          {data.map((generator) => (
            <div className="generator-container mb-4" key={generator.id}>
              <div className="form-header mb-2">
                <p className="h-mid-gray-s">{generator.name}</p>
              </div>

              <p className="pt-4">When fuel of the generator is</p>
              <div className="fuel-bar-100"></div>
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
