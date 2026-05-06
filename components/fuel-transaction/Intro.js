import Image from 'next/image';
import scan from '@/public/scan.png';
import { Camera, CheckCircle2, Fuel, Gauge } from 'lucide-react';
import { TransactionStepHeader } from './TransactionUi';

export default function IntroForm() {
  const steps = [
    {
      icon: Fuel,
      title: 'Set up transaction',
      description: 'Choose delivery or return, then select generator and tank.',
    },
    {
      icon: Camera,
      title: 'Capture before evidence',
      description: 'Photo the meter and record the reading before delivery or return.',
    },
    {
      icon: Gauge,
      title: 'Complete the fuel movement',
      description: 'Deliver fuel to equipment or return fuel to the external tank.',
    },
    {
      icon: CheckCircle2,
      title: 'Capture after evidence',
      description: 'Photo the meter again and record the final reading for proof.',
    },
  ];

  return (
    <div className="space-y-4">
      <TransactionStepHeader
        eyebrow="Instructions"
        title="Add fuel transaction"
        description="Capture before and after meter evidence for every delivery or return."
      />

      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <Image
          src={scan}
          alt="Scanning meter"
          className="m-auto h-36 w-36 object-contain"
        />

        <ol className="mt-4 flex flex-col gap-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li key={step.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                  <Icon size={19} strokeWidth={2.2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-gray-900">
                    {index + 1}. {step.title}
                  </span>
                  <span className="steps-text mt-1 block">
                    {step.description}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
