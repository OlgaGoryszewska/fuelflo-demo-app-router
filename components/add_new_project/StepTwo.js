export default function StepTwo() {
  return (
    <div className="m-4">
      <h2>Contact to Contractor</h2>
      <label>
        Name of the Contractor:
        <input name="contractor-name" type="text" required />
      </label>
      <label>
        Adress of the Contractor:
        <input name="contractor-adress" type="text" required />
      </label>
      <label>
        Email:
        <input name="email" type="email" required />
      </label>
      <label>
        Mobile Number:
        <input name="mobile" type="text" required />
      </label>
    </div>
  );
}
