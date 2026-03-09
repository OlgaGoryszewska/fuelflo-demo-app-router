

import Image from "next/image";
import scan from "@/public/scan.png"


export default function IntroForm() {
  return (
    <div>
      <div className="form-header-steps mb-4">
        <p className="steps-text pr-2">Instruction</p>
      </div>
      <section>
        <h2>Collect tank refill data in 4 steps</h2>
        <Image src={scan}  alt=" scaning meter" className="h-42 w-42 m-auto
        "/>

        <ol className="steps">
        <li>
           
            <strong className="highlight"> 1. Setup operation </strong>
          </li>
            
          <li>
          <strong className="highlight">2. </strong>  Take a photo of the 
            <strong className="highlight"> starting</strong> meter and enter meter reading
            NOW YOU CAN refill the tank
          </li>
          <li><strong className="highlight">3. </strong> Take a photo
            <strong className="highlight"> after </strong> the tank refill and enter meter current status
          </li>
          <li>
          <strong className="highlight">4. </strong>Review fuel data
          </li>
        </ol>
      </section>
    </div>
  );
}

