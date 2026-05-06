'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Fuel, QrCode, ScanLine } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import GeneratorDropdown from '@/components/add_new_project/GeneratorDropdown';
import TankDropdown from '@/components/dropdowns/tank-dropdown';
import MyToggleComponent from '../Toggle/ToggledTransaction';
import GeneratorQrScanner from '@/components/GeneratorQrScanner';
import { saveGenerators, saveTanks } from '@/lib/offline/fieldData';
import OfflineGeneratorSelect from '@/components/OfflineGeneratorSelect';
import OfflineTankSelect from '@/components/OfflineTankSelect';
import { TransactionFieldCard, TransactionStepHeader } from './TransactionUi';

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
  useEffect(() => {
    async function loadAndCache() {
      if (!navigator.onLine) return;

      const { data: generators } = await supabase
        .from('generators')
        .select('id, name');

      if (generators) {
        saveGenerators(generators);
      }

      const { data: tanks } = await supabase.from('tanks').select('id, name');

      if (tanks) {
        saveTanks(tanks);
      }
    }

    loadAndCache();
  }, []);

  const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine;

  return (
    <div className="space-y-4">
      <TransactionStepHeader
        eyebrow="Step 2 of 4"
        title="Set up transaction"
        description="Choose the transaction type and identify the equipment."
      />

      <TransactionFieldCard
        icon={Fuel}
        title="Transaction type"
        description="Pick the direction of the fuel movement."
      >
        <MyToggleComponent
          value={formData.type}
          onChange={(newType) =>
            setFormData((prev) => ({
              ...prev,
              type: newType,
            }))
          }
        />
      </TransactionFieldCard>

      <TransactionFieldCard
        icon={ScanLine}
        title="Generator"
        description="Scan the QR code or select the generator manually."
      >
        <button
          type="button"
          className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-[#d5eefc] bg-[#eef4fb] p-4 text-left shadow-sm transition active:scale-[0.98] active:bg-[#dbeaf5]"
          onClick={() => {
            setScanError('');
            setShowScanner(true);
          }}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#62748e] ring-1 ring-[#d5eefc]">
            <QrCode size={21} strokeWidth={2.2} />
          </span>
          <span>
            <span className="block text-base font-semibold text-gray-900">
              Scan QR code
            </span>
            <span className="steps-text mt-1 block">
              Fastest in the field when the QR label is available.
            </span>
          </span>
        </button>

        {isFetchingGenerator && (
          <p className="steps-text mb-3">Loading generator...</p>
        )}

        {scanError && (
          <p className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {scanError}
          </p>
        )}

        {formData.generator_name && (
          <p className="mb-3 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-3 text-sm font-medium text-green-700">
            <CheckCircle2 size={18} />
            Selected generator: {formData.generator_name}
          </p>
        )}

        {showScanner && (
          <GeneratorQrScanner
            onScanSuccess={handleQrScan}
            onClose={() => setShowScanner(false)}
            onError={setScanError}
          />
        )}

        <div className="divider mb-3">
          <h3 className="steps-text">or select manually</h3>
        </div>

        {isOnline ? (
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
        ) : (
          <OfflineGeneratorSelect
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </TransactionFieldCard>

      <TransactionFieldCard
        icon={Fuel}
        title="External tank"
        description="Select the fuel source or return tank."
      >
        {isOnline ? (
          <TankDropdown
            value={formData.tank_id}
            onChange={(tank) =>
              setFormData((prev) => ({
                ...prev,
                tank_id: tank?.id || '',
                tank_name: tank?.name || '',
              }))
            }
          />
        ) : (
          <OfflineTankSelect formData={formData} setFormData={setFormData} />
        )}
      </TransactionFieldCard>
    </div>
  );
}
