'use client';
import Image from 'next/image';
import qr2 from '@/public/qr2.png';
import GeneratorDropdown from '@/components/add_new_project/GeneratorDropdown';
import TankDropdown from '@/components/dropdowns/tank-dropdown';

export default function StepOneFuelReturnForm() {
  return (
    <form className="form-no-style">
       <p className="h-mid-gray-s " >Generator</p>
       <p className="steps-text " >Skan or select to identify</p>

      <button className="qr-code-scanning-button mb-2">
        <Image 
        alt="qr code to scan"
        src={qr2}
        className='w-28 '/>
        <p>Skan QR Code</p>
      </button>
      <div className="divider">
        <h3 className="steps-text">or</h3>
      </div>

      

      <GeneratorDropdown />
      <p className="h-mid-gray-s " >External Tank</p>
      <TankDropdown />
    </form>
  );
}
