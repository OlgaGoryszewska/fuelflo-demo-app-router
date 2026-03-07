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
            Take a photo of the 
            <strong className="highlight"> starting</strong> meter
          </li>
          <li>Scan or enter the meter reading</li>
          <li>Take a photo
            <strong className="highlight"> after</strong> the tank refill
          </li>
          <li>
            Scan or enter {' '}
            <strong className="highlight"> the final</strong> meter reading
          </li>
        </ol>
      </section>
    </div>
  );
}

