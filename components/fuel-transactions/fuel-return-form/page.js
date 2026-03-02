'use client';
import Image from 'next/image';
import returnImage from '@/public/return.png';
import GeneratorDropdown from '../../add_new_project/GeneratorDropdown';
import TankDropdown from '@/components/dropdowns/tank-dropdown';

export default function FuelReturnForm() {
  return (
    <div>
      <Image src={returnImage} alt="Description of my image" className="mb-4" />
      <button className="button-big-border-orange mb-4 ">
      
        Skan QR Code
      </button>

      <div className="flex flex-col items-center">
        <h3 className="delivery ">or</h3>
      </div>
      <GeneratorDropdown />
      <label className="delivery ">Select external tank:</label>
      <TankDropdown />
    </div>
  );
}
