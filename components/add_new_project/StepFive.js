'use client';



export default function StepFive({ formData }) {
  return (
    <div className="mx-4 ">
      <h2 className="">Review Before Submitting</h2>

      <h2 className="">Project Specification</h2>
      <div className=" flex flex-row">
     
       
        <h4>Name of the Project </h4>
      </div>
      <p className="steps-text">{formData.name}</p>
      <div className=" flex flex-row">
        
        <h4 >Localisation of the Project </h4>
      </div>
      <p className="steps-text">{formData.location}</p>
      <div className=" flex flex-row">
        
        <h4>Release Date </h4>
      </div>
      <p className="steps-text">{formData.start_date}</p>
      <div className=" flex flex-row">
        
        <h4>End Date </h4>
      </div>
      <p className="steps-text">{formData.end_date}</p>
      <h2 >Contact to Contractor</h2>
      <div className=" flex flex-row">
       
        <h4>Name of the Contractor</h4>
      </div>
      <p className="steps-text">{formData.contractor_name}</p>
      <div className=" flex flex-row">
        
        <h4> Address of the Contractor</h4>
      </div>
      <p className="steps-text">{formData.contractor_address}</p>
      <div className=" flex flex-row">
       
        <h4>Email</h4>
      </div>
      <p className="steps-text">{formData.email}</p>
      <div className=" flex flex-row">
       
        <h3>Mobile </h3>
      </div>
      <p className="steps-text">{formData.mobile}</p>
      <h2 >Setup</h2>
      <div className=" flex flex-row">
       
        <h4>Technicians: </h4>
      </div>
      <p className="steps-text">
  {formData.technicians.map((tech) => tech.name).join(', ')}
</p>
<h4>Generators:</h4>

      <p className="steps-text">{formData.generator_name}</p>
      <h4>Tanks:</h4>
      <p className="steps-text">
        {typeof formData.tank === 'object'
          ? formData.tank?.name
          : formData.tank}
      </p>
      <h2>Fuel Pricing Details</h2>
      <div className=" flex flex-row">
      
        <h4>Purchase Price </h4>
      </div>
      <p className="steps-text">{formData.amount}</p>
      <div className=" flex flex-row">
      
        <h4>Selling Price </h4>
      </div>
      <p className="steps-text">{formData.selling_price}</p>
      <h2>Notes</h2>
      <div className=" flex flex-row">
        
        <h4>Specification of the project</h4>
      </div>
      <p className="steps-text">{formData.specification}</p>
      <div className=" flex flex-row">
      
        <h4>Additional Note</h4>
      </div>
      <p className="steps-text">{formData.additional}</p>
    </div>
  );
}
