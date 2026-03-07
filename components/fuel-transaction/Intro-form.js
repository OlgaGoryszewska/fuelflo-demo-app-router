export default function IntroForm() {
  return (
    <div>
      <div className="form-header-steps mb-4">
        <p className="steps-text pr-2">Instructions</p>
      </div>
      <section>
        <h2>Collect tank refill evidence in 4 steps</h2>

        <ol className="steps">
          <li>
            1. Take a photo of the 
            <strong className="highlight"> starting</strong> meter
          </li>
          <li>2. Scan or enter the meter reading</li>
          <li>3. Take a photo
            <strong className="highlight"> after</strong> the tank refill
          </li>
          <li>
            4. Scan or enter the final meter reading
          </li>
        </ol>
      </section>
    </div>
  );
}

