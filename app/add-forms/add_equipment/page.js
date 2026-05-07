import Image from 'next/image';
import tank from '@/public/tank.png';
import generator from '@/public/generator.png';
import Link from 'next/link';
import { Fuel, Zap } from 'lucide-react';
import { TransactionFieldCard, TransactionStepHeader } from '@/components/fuel-transaction/TransactionUi';

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
    <div className="main-container">
      <div className="form-header mt-4">
        <h1 className="ml-2">Add equipment</h1>
      </div>

      <div className="form-transaction">
        <TransactionStepHeader
          eyebrow="Resources"
          title="Add equipment"
          description="Create generator and external tank records for field operations."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {equipmentLinks.map((item) => (
            <EquipmentLink key={item.href} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EquipmentLink({ item }) {
  const Icon = item.icon;

  return (
    <Link href={item.href} className="block transition active:scale-[0.98]">
      <TransactionFieldCard
        icon={Icon}
        title={item.title}
        description={item.description}
      >
        <Image
          src={item.image}
          alt={item.imageAlt}
          className="mx-auto h-24 w-24 object-contain"
        />
      </TransactionFieldCard>
    </Link>
  );
}
