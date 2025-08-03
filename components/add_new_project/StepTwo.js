
// add function and event listener also forma Data properties onChange like in step one

export default function StepTwo() {
  return (
    <div className="m-4">
      <h2>Contact to Contractor</h2>
      <label>
        Name of the Contractor:
        <input name="contractor_name" type="text" required />
      </label>
      <label>
        Adress of the Contractor:
        <input name="contractor_adress" type="text" required />
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
