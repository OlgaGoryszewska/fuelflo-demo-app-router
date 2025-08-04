'use client';
//make a CSS style than create a submit function that will log the formData to the console
// : '',  contractor_adress: '',email: '',mobile:''

export default function StepFive({ formData }) {
  return (
    <div className="mx-4 ">
      <h3 className="text-primary-gray-light">Review Before Submitting</h3>

      <h3
      
        className="form-header
       "
      >
        Project Specification
      </h3
      >
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">brick</span>
        <h3 className="">Name of the Project: </h3>
      </div>
      <p className="pl-8 pb-2 text-orange-200">{formData.name}</p>
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">location_on</span>
        <h3
         className="">Localisation of the Project: </h3
        >
      </div>
      <p className="pl-8 pb-2">{formData.location}</p>
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">today</span>
        <h3
         className="">Relase Date: </h3
        >
      </div>
      <p className="pl-8 pb-2">{formData.releaseDate}</p>
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">today</span>
        <h3
         className="">End Date: </h3
        >
      </div>
      <p className="pl-8 pb-2">{formData.endDate}</p>
      <h3 className="form-header"
      > Contact to Contractor</h3
      >
      <div className=" flex flex-row">
        <span class="material-symbols-outlined">contacts_product</span>
        <h3
         className="">Name of the Contractor: </h3
        >
      </div>
      <p className="pl-8 pb-2">{formData.contractor_name}</p>
    </div>
  );
}
