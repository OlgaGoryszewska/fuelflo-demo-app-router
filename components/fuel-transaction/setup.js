'use client';

import { useState } from 'react';
import Image from 'next/image';
import qr2 from '@/public/qr2.png';
import { supabase } from '@/lib/supabaseClient';
import GeneratorDropdown from '@/components/add_new_project/GeneratorDropdown';
import TankDropdown from '@/components/dropdowns/tank-dropdown';
import MyToggleComponent from '../Toggle/ToggledTransaction';
import GeneratorQrScanner from '@/components/GeneratorQrScanner';

export default function Setup({ formData, setFormData }) {
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState('');
  const [isFetchingGenerator, setIsFetchingGenerator] = useState(false);

  const handleQrScan = async (generatorId) => {
    try {
      setScanError('');
      setIsFetchingGenerator(true);

      const { data, error } = await supabase
        .from('generators')
        .select('id, name')
        .eq('id', generatorId)
        .single();

      if (error) {
        throw error;
      }

      setFormData((prev) => ({
        ...prev,
        generator_id: data.id,
        generator_name: data.name,
      }));

      setShowScanner(false);
    } catch (error) {
      console.error('Error fetching generator:', error);
      setScanError('Generator not found for this QR code.');
    } finally {
      setIsFetchingGenerator(false);
    }
  };

  return (
    <div>
      <div className="form-header-steps">
        <p className="steps-text pr-2">Step 1 of 5</p>
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

      <p className="h-mid-gray-s">Generator</p>
      <p className="steps-text">Scan or select to identify</p>

      <button
        type="button"
        className="qr-code-scanning-button my-2 flex flex-row items-center justify-center gap-2"
        onClick={() => {
          setScanError('');
          setShowScanner(true);
        }}
      >
        <Image alt="qr code to scan" src={qr2} className="w-28" />
        <p>Scan QR Code</p>
      </button>

      {isFetchingGenerator && (
        <p className="steps-text mt-2">Loading generator...</p>
      )}

      {scanError && <p className="mt-2 text-sm text-red-600">{scanError}</p>}

      {formData.generator_name && (
        <p className="mt-2 text-sm text-green-700">
          Selected generator: <span className="font-medium">{formData.generator_name}</span>
        </p>
      )}

      {showScanner && (
        <GeneratorQrScanner
          onScanSuccess={handleQrScan}
          onClose={() => setShowScanner(false)}
          onError={setScanError}
        />
      )}

      <div className="divider">
        <h3 className="steps-text">or</h3>
      </div>

      <p className="h-mid-gray-s">Select generator</p>
      <GeneratorDropdown
        value={formData.generator_id}
        onChange={(generator) =>
          setFormData((prev) => ({
            ...prev,
            generator_id: generator.id,
            generator_name: generator.name,
          }))
        }
      />

      <p className="h-mid-gray-s pt-2">Select external tank</p>
      <TankDropdown
        value={formData.tank_id}
        onChange={(tank) =>
          setFormData((prev) => ({
            ...prev,
            tank_id: tank.id,
            tank_name: tank.name,
          }))
        }
      />
    </div>
  );
}