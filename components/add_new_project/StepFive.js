'use client';

export default function StepFive({ formData }) {
  const technicians = formData.technicians || [];
  const generators = formData.generators || [];

  return (
    <div className="mx-4">
      <h2>Review Before Submitting</h2>

      <h2>Project Specification</h2>

      <div className="flex flex-row">
        <h4>Name of the Project</h4>
      </div>
      <p className="steps-text">{formData.name || '-'}</p>

      <div className="flex flex-row">
        <h4>Localisation of the Project</h4>
      </div>
      <p className="steps-text">{formData.location || '-'}</p>

      <div className="flex flex-row">
        <h4>Release Date</h4>
      </div>
      <p className="steps-text">{formData.start_date || '-'}</p>

      <div className="flex flex-row">
        <h4>End Date</h4>
      </div>
      <p className="steps-text">{formData.end_date || '-'}</p>

      <h2>Contact to Contractor</h2>

      <div className="flex flex-row">
        <h4>Name of the Contractor</h4>
      </div>
      <p className="steps-text">{formData.contractor_name || '-'}</p>

      <div className="flex flex-row">
        <h4>Address of the Contractor</h4>
      </div>
      <p className="steps-text">{formData.contractor_address || '-'}</p>

      <div className="flex flex-row">
        <h4>Email</h4>
      </div>
      <p className="steps-text">{formData.email || '-'}</p>

      <div className="flex flex-row">
        <h4>Mobile</h4>
      </div>
      <p className="steps-text">{formData.mobile || '-'}</p>

      <h2>Setup</h2>

      <div className="flex flex-row">
        <h4>Technicians</h4>
      </div>
      <p className="steps-text">
        {technicians.length > 0
          ? technicians.map((tech) => tech.name).join(', ')
          : 'None'}
      </p>

      <div className="flex flex-row">
        <h4>Generators and Tanks</h4>
      </div>

      {generators.length === 0 ? (
        <p className="steps-text">No generators assigned</p>
      ) : (
        <div className="flex flex-col gap-3">
          {generators.map((gen) => (
            <div key={gen.id} className="">
              <p className="steps-text font-semibold">{gen.name}</p>

              {(gen.tanks || []).length === 0 ? (
                <p className="steps-text">No tanks assigned</p>
              ) : (
                <ul className="">
                  {(gen.tanks || []).map((tank) => (
                    <li key={tank.id} className="steps-text">
                      {tank.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <h2>Fuel Pricing Details</h2>

      <div className="flex flex-row">
        <h4>Purchase Price</h4>
      </div>
      <p className="steps-text">{formData.amount || '-'}</p>

      <div className="flex flex-row">
        <h4>Selling Price</h4>
      </div>
      <p className="steps-text">{formData.selling_price || '-'}</p>

      <h2>Notes</h2>

      <div className="flex flex-row">
        <h4>Specification of the project</h4>
      </div>
      <p className="steps-text">{formData.specification || '-'}</p>

      <div className="flex flex-row">
        <h4>Additional Note</h4>
      </div>
      <p className="steps-text">{formData.additional || '-'}</p>
    </div>
  );
}
