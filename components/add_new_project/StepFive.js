export default function StepFive() {
  return (
    <div className="m-4">
      <h2>Notes</h2>
      <label>
        Specification of the project:
        <input name="specification" type="text" required />
      </label>
      <label>
        Additional Note:
        <input name="additional" type="text" required />
      </label>
    </div>
  );
}
