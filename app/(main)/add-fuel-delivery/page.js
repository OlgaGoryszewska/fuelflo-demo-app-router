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
      </form>
    </div>
  );
}
