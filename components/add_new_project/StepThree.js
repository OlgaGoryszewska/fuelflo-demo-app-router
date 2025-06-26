export default function StepThree() {
  return (
    <div className="m-4">
      <h2>Setup</h2>
      <label>
        Add Technician:
        <input name="technician" type="text" required />
      </label>
      <h2 className="mt-4">Add Fleet</h2>
      <label>
        Add Generator:
        <input name="generator" type="text" required />
      </label>
      <label>
        Add Fuel Tank:
        <input name="tank" type="text" required />
      </label>
    </div>
  );
}
