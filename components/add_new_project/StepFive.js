'use client';

export default function StepFive({ formData }) {
  return (
    <div className="mx-4 ">
      <h3 className="text-primary-gray-light">Review Before Submitting</h3>

      <h3 className="form-header-gray">Project Specification</h3>
      <div className=" flex flex-row">
        <span className
        ="material-symbols-outlined ">brick</span>
        <h3 className="">Name of the Project </h3>
      </div>
      <p className="form-data-to-read-only">{formData.name}</p>
      <div className=" flex flex-row">
        <span className
        ="material-symbols-outlined">location_on</span>
        <h3 className="">Localisation of the Project </h3>
      </div>
      <p className="form-data-to-read-only">{formData.location}</p>
      <div className=" flex flex-row">
        <span className
        ="material-symbols-outlined">today</span>
        <h3 className="">Relase Date </h3>
      </div>
      <p className="form-data-to-read-only">{formData.releaseDate}</p>
      <div className=" flex flex-row">
        <span className
        ="material-symbols-outlined">today</span>
        <h3 className="">End Date </h3>
      </div>
      <p className="form-data-to-read-only">{formData.endDate}</p>
      <h3 className="form-header-gray">Contact to Contractor</h3>
      <div className=" flex flex-row">
        <span className
        ="material-symbols-outlined">contacts_product</span>
        <h3 className="">Name of the Contractor</h3>
      </div>
      <p className="form-data-to-read-only">{formData.contractor_address}</p>
      <div className=" flex flex-row">
        <span className
        ="material-symbols-outlined">location_on</span>
        <h3 className=""> Adress of the Contractor</h3>
      </div>
      <p className="form-data-to-read-only">{formData.contractor_name}</p>
      <div className=" flex flex-row">
        <span className
        ="material-symbols-outlined">mail</span>
        <h3 className="">Email</h3>
      </div>
      <p className="form-data-to-read-only">{formData.email}</p>
      <div className=" flex flex-row">
        <span className="material-symbols-outlined">mobile</span>
        <h3 className="">Mobile </h3>
      </div>
      <p className="form-data-to-read-only">{formData.mobile}</p>
      <h3 className="form-header-gray">Setup</h3>
      <div className=" flex flex-row">
        <span className="material-symbols-outlined ">person_apron</span>
        <h3 className="">Add Technician </h3>
      </div>
      <p className="form-data-to-read-only">{formData.technician}</p>
      <h3 className="form-header-gray">Add Fleet</h3>
      <div className=" flex flex-row">
        <span className="material-symbols-outlined">battery_charging_50</span>
        <h3 className="">Add Generator</h3>
      </div>
      <p className="form-data-to-read-only">{formData.generator}</p>
      <div className=" flex flex-row">
        <span className="material-symbols-outlined">oil_barrel</span>
        <h3 className="">Add Fuel Tank</h3>
      </div>
      <p className="form-data-to-read-only">{formData.tank}</p>
      <h3 className="form-header-gray">Fuel Pricing Details</h3>
      <div className=" flex flex-row">
        <span className="material-symbols-outlined">attach_money</span>
        <h3 className="">Purchase Price </h3>
      </div>
      <p className="form-data-to-read-only">{formData.amount}</p>
      <div className=" flex flex-row">
        <span className="material-symbols-outlined">attach_money</span>
        <h3 className="">Selling Price </h3>
      </div>
      <p className="form-data-to-read-only">{formData.selling_price}</p>
      <h3 className="form-header-gray">Notes</h3>
      <div className=" flex flex-row">
        <span className="material-symbols-outlined">sticky_note_2</span>
        <h3  className="">Specification of the project</h3>
      </div>
      <p className="form-data-to-read-only">{formData.specification}</p>
      <div className=" flex flex-row">
        <span className
        ="material-symbols-outlined">note_stack_add</span>
        <h3 className="">Additional Note</h3>
      </div>
      <p className="form-data-to-read-only">{formData.additional}</p>
    </div>
  );
}
