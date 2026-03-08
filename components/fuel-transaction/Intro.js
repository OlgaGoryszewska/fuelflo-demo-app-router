

import Image from "next/image";
import scan from "@/public/scan.png"


export default function IntroForm() {
  return (
    <div>
      <div className="form-header-steps mb-4">
        <p className="steps-text pr-2">Instruction</p>
      </div>
      <section>
        <h2>Collect tank refill evidence in 5 steps</h2>
        <Image src={scan}  alt=" scaning meter" className="h-42 w-42 m-auto
        "/>

        <ol className="steps">
        <li>
           
            <strong className="highlight"> 1. Setup</strong>
          </li>
            
          <li>
          <strong className="highlight">2. </strong>  Take a photo of the 
            <strong className="highlight"> starting</strong> meter
          </li>
          <li><strong className="highlight">3. </strong> Scan or enter the meter reading</li>
          <li><strong className="highlight">4. </strong> Take a photo
            <strong className="highlight"> after </strong> the tank refill
          </li>
          <li>
          <strong className="highlight">5. </strong> Scan or enter the final meter reading
          </li>
        </ol>
      </section>
    </div>
  );
}

