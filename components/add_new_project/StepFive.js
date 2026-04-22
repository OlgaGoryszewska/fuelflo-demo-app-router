'use client';

export default function StepFive({ formData }) {
  const technicians = formData.technicians || [];
  const generators = formData.generators || [];

  return (
    <div className="mx-4">
      <p className="steps-text">Review Before Submitting</p>
      <div className="divider-full mb-4"></div>

      <h2>Project Specification</h2>

      <h4>Name of the Project</h4>

      <p className="steps-text mb-2">{formData.name || '-'}</p>

      <h4>Localisation of the Project</h4>

      <p className="steps-text mb-2">{formData.location || '-'}</p>

      <h4>Release Date</h4>

      <p className="steps-text mb-2">{formData.start_date || '-'}</p>

      <div className="flex flex-row">
        <h4>End Date</h4>
      </div>
      <p className="steps-text mb-2">{formData.end_date || '-'}</p>

      <h2>Contact to Contractor</h2>

      <div className="flex flex-row">
        <h4>Name of the Contractor</h4>
      </div>
      <p className="steps-text mb-2">{formData.contractor_name || '-'}</p>

      <div className="flex flex-row">
        <h4>Address of the Contractor</h4>
      </div>
      <p className="steps-text mb-2">{formData.contractor_address || '-'}</p>

      <div className="flex flex-row">
        <h4>Email</h4>
      </div>
      <p className="steps-text mb-2">{formData.email || '-'}</p>

      <div className="flex flex-row">
        <h4>Mobile</h4>
      </div>
      <p className="steps-text mb-2">{formData.mobile || '-'}</p>

      <h2>Setup</h2>

      <div className="flex flex-row">
        <h4>Manager</h4>
      </div>
      <p className="steps-text mb-2">{formData.manager?.name || '-'}</p>

      <div className="flex flex-row">
        <h4>Technicians</h4>
      </div>
      <p className="steps-text mb-2">
        {technicians.length > 0
          ? technicians.map((tech) => tech.name).join(', ')
          : 'None'}
      </p>

      <div className="flex flex-row">
        <h4>Generators and Tanks</h4>
      </div>

      {generators.length === 0 ? (
        <p className="steps-text mb-2">No generators assigned</p>
      ) : (
        <div className="flex flex-col gap-3">
          {generators.map((gen) => (
            <div key={gen.id}>
              <p className="steps-text mb-2 font-semibold">{gen.name}</p>

              {(gen.tanks || []).length === 0 ? (
                <p className="steps-text mb-2">No tanks assigned</p>
              ) : (
                <ul>
                  {(gen.tanks || []).map((tank) => (
                    <li key={tank.id} className="steps-text mb-2">
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
      <p className="steps-text mb-2">{formData.amount || '-'}</p>

      <div className="flex flex-row">
        <h4>Selling Price</h4>
      </div>
      <p className="steps-text mb-2">{formData.selling_price || '-'}</p>

      <h2>Notes</h2>

      <div className="flex flex-row">
        <h4>Specification of the project</h4>
      </div>
      <p className="steps-text mb-2">{formData.specification || '-'}</p>

      <div className="flex flex-row">
        <h4>Additional Note</h4>
      </div>
      <p className="steps-text mb-2">{formData.additional || '-'}</p>

      <h2>Status</h2>
      <p className="steps-text mb-2">
        {formData.active ? 'Active' : 'Inactive'}
      </p>
    </div>
  );
}
