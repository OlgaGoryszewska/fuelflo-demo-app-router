'use client';
//make a CSS style than create a submit function that will log the formData to the console
// : '',  contractor_adress: '',email: '',mobile:''

export default function StepFive({ formData }) {
  return (
    <div className="mx-4 ">
      <h3 className="text-primary-gray-light">Review Before Submitting</h3>

      <h3
      
        className="form-header-gray">
        Project Specification
      </h3
      >
      <div className=" flex flex-row">
        <span class="material-symbols-outlined ">brick</span>
        <h3 className="">Name of the Project </h3>
      </div>
      <p className="form-data-to-read-only">{formData.name}</p>
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">location_on</span>
        <h3
         className="">Localisation of the Project </h3
        >
      </div>
      <p className="form-data-to-read-only">{formData.location}</p>
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">today</span>
        <h3
         className="">Relase Date </h3
        >
      </div>
      <p className="form-data-to-read-only">{formData.releaseDate}</p>
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">today</span>
        <h3
         className="">End Date </h3
        >
      </div>
      <p className="form-data-to-read-only">{formData.endDate}</p>
      <h3 className="form-header-gray">
      Contact to Contractor</h3
      >
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">contacts_product</span>
        <h3
         className="">Name of the Contractor</h3
        >
      </div>
      <p className="form-data-to-read-only">{formData.contractor_name}</p>
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">location_on</span>
        <h3
         className=""> Adress of the Contractor</h3
        >
      </div>
      <p className="form-data-to-read-only">{formData.contractor_name}</p>
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">mail</span>
        <h3
         className="">Email</h3
        >
      </div>
      <p className="form-data-to-read-only">{formData.email}</p>
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">mobile</span>
        <h3
         className="">Mobile </h3
        >
      </div>
      <p className="form-data-to-read-only">{formData.mobile}</p>
      <h3
      
        className="form-header-gray">
        Setup
      </h3
      >
      <div className=" flex flex-row">
        <span class="material-symbols-outlined ">person_apron</span>
        <h3 className="">Add Technician </h3>
      </div>
      <p className="form-data-to-read-only">{formData.technician}</p>
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">battery_charging_50</span>
        <h3
         className="">Add Generator</h3
        >
      </div>
      <p className="form-data-to-read-only">{formData.generator}</p>
    </div>
    
    
  );
}
