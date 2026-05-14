import Image from 'next/image';
import tank from '@/public/tank.png';
import generator from '@/public/generator.png';
import Link from 'next/link';
import { ArrowRight, Boxes, Fuel, Plus, Zap } from 'lucide-react';

const equipmentLinks = [
  {
    href: '/add-forms/add_equipment/external-tank',
    title: 'External tank',
    description: 'Add a fuel tank for deliveries and returns.',
    image: tank,
    imageAlt: 'External tank',
    icon: Fuel,
  },
  {
    href: '/add-forms/add_equipment/generator',
    title: 'Generator',
    description: 'Add generator specifications and fleet details.',
    image: generator,
    imageAlt: 'Generator',
    icon: Zap,
  },
];

export default function AddEquipment() {
  return (
    <main className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Resources</p>
      </div>

      <section className="mb-4 rounded-[28px] border border-[#d9e2ec] bg-gradient-to-br from-white via-[#f8fbff] to-[#d5eefc] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">
              Equipment setup
            </p>
            <h2 className="mt-2">Add equipment</h2>
            <p className="steps-text mt-1">
              Create generator and external tank records for field operations.
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#62748e] ring-1 ring-white">
            <Boxes size={23} strokeWidth={2.4} />
          </span>
        </div>
      </section>

      <section className="background-container-white mb-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {equipmentLinks.map((item) => (
            <EquipmentLink key={item.href} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

function EquipmentLink({ item }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group block overflow-hidden rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)] transition active:scale-[0.98] active:border-[#62748e] active:bg-[#eef4fb]"
      >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
          <Icon size={21} strokeWidth={2.2} />
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d5eefc] bg-white text-[#62748e] transition group-active:translate-x-0.5">
          <ArrowRight size={16} strokeWidth={2.3} />
        </span>
      </div>

      <div className="min-w-0">
        <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
        <p className="steps-text mt-1">{item.description}</p>
      </div>

      <div className="mt-5 rounded-[22px] border border-[#e8edf3] bg-[#f8fbff] p-4">
        <Image
          src={item.image}
          alt={item.imageAlt}
          className="mx-auto h-24 w-24 object-contain"
        />
      </div>

      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d5eefc] bg-[#f5fbff] px-3 py-1 text-xs font-semibold text-[#62748e]">
        <Plus size={13} strokeWidth={2.3} />
        Create record
      </div>
    </Link>
  );
}
