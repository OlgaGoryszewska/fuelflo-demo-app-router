'use client';
//make a CSS style than create a submit function that will log the formData to the console

export default function StepFive({ formData }) {
  return (
    <div className="ml-4">
      <h2 className="">Review Before Submitting</h2>

      <h2> Project Specification</h2>
        <div className=" flex flex-row">
          <span class="material-symbols-outlined">brick</span>
          <h2 className="">Name of the Project: </h2>
        </div>
        <p className="pl-8 pb-2">{formData.name}</p>
        <div className=" flex flex-row">
          <span class="material-symbols-outlined">location_on</span>
          <h2 className="">Localisation of the Project: </h2>
        </div>
        <p className="pl-8 pb-2">{formData.location}</p>
        <div className=" flex flex-row">
          <span class="material-symbols-outlined">today</span>
          <h2 className="">Relase Date: </h2>

        </div>
        <p className="pl-8 pb-2">{formData.releaseDate}</p>
        <div className=" flex flex-row">
          <span class="material-symbols-outlined">today</span>
          <h2 className="">End Date: </h2>
        </div>
        <p className="pl-8 pb-2">{formData.endDate}</p>
    </div>
  );
}
