'use client';
import Image from 'next/image';
import returnImage from '@/public/return.png';
import GeneratorDropdown from '@/components/add_new_project/GeneratorDropdown';
import TankDropdown from '@/components/dropdowns/tank-dropdown';

export default function FuelReturnForm() {
  return (
    <form className="form-no-style">
      <Image src={returnImage} alt="Description of my image" className="mb-4" />
      <button className="button-big-border-orange mb-4 ">
        <span className="material-symbols-outlined black pr-2">qr_code</span>
        Skan Generator QR Code
      </button>

      <div className="flex flex-col items-center">
        <h3 className="delivery ">or</h3>
        </div>
      
      <GeneratorDropdown />
      <label >Select external tank:</label>
      <TankDropdown />
      
    </form>
  );
}
