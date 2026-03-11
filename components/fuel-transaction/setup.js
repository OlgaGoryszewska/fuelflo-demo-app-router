'use client';
import Image from 'next/image';
import qr2 from '@/public/qr2.png';
import GeneratorDropdown from '@/components/add_new_project/GeneratorDropdown';
import TankDropdown from '@/components/dropdowns/tank-dropdown';
import MyToggleComponent from '../Toggle/ToggledTransaction';

export default function Setup({ formData, setFormData }) {
  return (
    <div>
      <div className="form-header-steps">
        <p className="steps-text pr-2">Step 1 of 5 </p>
      </div>

      <MyToggleComponent
        value={formData.type}
        onChange={(newType) =>
          setFormData((prev) => ({
            ...prev,
            type: newType,
          }))
        }
      />
      <p className="h-mid-gray-s ">Generator</p>
      <p className="steps-text ">Skan or select to identify</p>

      <button className="qr-code-scanning-button my-2">
        <Image alt="qr code to scan" src={qr2} className="w-28 " />
        <p>Skan QR Code</p>
      </button>

      <div className="divider">
        <h3 className="steps-text">or</h3>
      </div>
      <p className="h-mid-gray-s ">Select generator</p>
      <GeneratorDropdown
        value={formData.generator_id}
        onChange={(newGeneratorId) =>
          setFormData((prev) => ({
            ...prev,
            generator_id: newGeneratorId,
          }))
        }
      />
      <p className="h-mid-gray-s pt-2">Select external tank</p>
      <TankDropdown />
    </div>
  );
}
