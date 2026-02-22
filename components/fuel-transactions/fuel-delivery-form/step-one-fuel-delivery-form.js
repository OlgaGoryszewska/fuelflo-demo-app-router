// make a form on submitt
// add steps
// add navigation
// add validation





'use client';
import Image from 'next/image';
import delivery from '@/public/delivery.png';
import GeneratorDropdown from '../../add_new_project/GeneratorDropdown';

export default function StepOneFuelDeliveryForm() {
  return (
    <form className='form-no-style'>
      <p className="mb-4 font-medium text-center ">
        You currently perform fuel Delivery
      </p>
      <Image
        src={delivery} 
        alt="Description of my image"
        className="mb-4"
      />
      <button className="button-big-border-orange mb-4 ">
        <span className="material-symbols-outlined black pr-2">qr_code</span>
        Skan Generator QR Code
      </button>

      <div className="flex flex-col items-center">
        <h3 className="delivery ">or</h3>
        <GeneratorDropdown />
        
      </div>
      
    </form>
  );
}
