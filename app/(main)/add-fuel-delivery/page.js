import ProgresionBar from "@/components/ProgresionBar";


export default function AddFuelDeliveryPage() {
  return (
    <div className="main-container">
      <form>
        <div className="form-header">
          <span class="material-symbols-outlined big ">add</span>
          <h1>Add new Project</h1>
        </div>
        <ProgresionBar/>
       <div className="m-4">
       <label>
       You are currently on the project:
        <input
          name="name"
          type="text"
        />
      </label>
      <label>
       Find Generator:
        <input
          name="name"
          type="text"
        />
      </label>
      <label>
       Find Tank:
        <input
          name="name"
          type="text"
        />
      </label>
      <label>
       Add Date of Delivery:
        <input
          name="name"
          type="text"
        />
      </label>
      
       </div>
      </form>
    </div>
  );
}
