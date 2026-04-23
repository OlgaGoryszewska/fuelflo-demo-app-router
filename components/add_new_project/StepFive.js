'use client';

export default function StepFive({ formData }) {
  const technicians = formData.technicians || [];
  const generators = formData.generators || [];

  return (
    <div className="mx-4">
      <p className="steps-text">Review Before Submitting</p>
      <div className="divider-full mb-4"></div>

      <h4 className="my-2 ">Project Specification</h4>
      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
      <p className="steps-text">Name of the Project</p>

      <p className="h-mid-gray-s ">{formData.name || '-'}</p>
    </div>
      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
      <p className="steps-text">Localisation of the Project</p>

      <p className="h-mid-gray-s">{formData.location || '-'}</p>
      </div>
      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
      <p className="steps-text">Release Date</p>

      <p className="h-mid-gray-s ">{formData.start_date || '-'}</p>
      </div>
      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
  
      <p className="steps-text">End Date</p>
       
    
      <p className="h-mid-gray-s ">{formData.end_date || '-'}</p>
  </div>
      <h4 className="my-2 ">Contact to Contractor</h4>

      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
        <p className="steps-text ">Name of the Contractor</p>
     
      <p className="h-mid-gray-s ">{formData.contractor_name || '-'}</p>
 </div>
      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
        <p className="steps-text ">Address of the Contractor</p>
    
      <p className="h-mid-gray-s">{formData.contractor_address || '-'}</p>
  </div>
      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
        <p className="steps-text ">Email</p>
      
      <p className="h-mid-gray-s">{formData.email || '-'}</p>
</div>
      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
        <p className="steps-text ">Mobile</p>
     
      <p className="h-mid-gray-s ">{formData.mobile || '-'}</p>
    </div>
      <h4 className="my-2 ">Setup</h4>

      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
        <p className="steps-text">Manager</p>
      
      <p className="h-mid-gray-s mb-2">{formData.manager?.name || '-'}</p>
</div>
      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
        <p className="steps-text">Technicians</p>
     
      <p className="h-mid-gray-s  mb-2">
        {technicians.length > 0
          ? technicians.map((tech) => tech.name).join(', ')
          : 'None'}
      </p>
 </div>
      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
        <p className="steps-text">Generators and Tanks</p>
     

      {generators.length === 0 ? (
        <p className="h-mid-gray-s ">No generators assigned</p>
      ) : (
        <div className="flex flex-col">
          {generators.map((gen) => (
            <div key={gen.id}>
              <p className="h-mid-gray-s "> Generator {gen.name}</p>

              {(gen.tanks || []).length === 0 ? (
                <p className="h-mid-gray-s ">No tanks assigned</p>
              ) : (
                <ul>
                  {(gen.tanks || []).map((tank) => (
                    <li key={tank.id} className="h-mid-gray-s">
                      {tank.name} (tank)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )} 
      </div>

      <h4 className="my-2 ">Fuel Pricing Details</h4>

      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
        <p className="steps-text ">Purchase Price</p>
      
      <p className="h-mid-gray-s ">{formData.amount || '-'}</p>
       </div>
      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
        <p className="steps-text">Selling Price</p>
     
      <p className=" h-mid-gray-s ">{formData.selling_price || '-'}</p>
      </div>
      <h4 className="my-2 ">Details</h4>

      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
        <p className=" steps-text ">Specification of the project</p>
      <p className=" h-mid-gray-s ">{formData.specification || '-'}</p>
      </div>
      <div className=" mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2" >
        <p className="steps-text ">Additional Note</p>
        <p className=" h-mid-gray-s  ">{formData.additional || '-'}</p>
      </div>
    
      <div className="mb-2 flex flex-col  rounded-xl text-[#62748e] bg-[#f5fbff] p-2">
      <p className="steps-text">Status</p>
      <p className=" h-mid-gray-s">
        {formData.active ? 'Active' : 'Inactive'}
      </p>
      </div>
    </div>
  );
}
