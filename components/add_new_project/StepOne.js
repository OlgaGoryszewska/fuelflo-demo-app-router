export default function StepOne() {
  return (
    <div className="m-4">
      <h2>Project Specification</h2>
      <label>
        Name of the Project:
        <input name="name" type="text" required />
      </label>
      <label>
        Localisation of the Project:
        <input name="location" type="text" required />
      </label>
      <label>
        Release Date:
        <input type="date" name="releaseDate" required />
      </label>
      <label>
        End Date:
        <input type="date" name="endDate" required />
      </label>
    </div>
  );
}
