'use client';
import Image from 'next/image';
import delivery from '@/public/delivery.png';

export default function FuelDeliveryForm() {
  return (
    <div>
      <p className="mb-4 font-medium text-center ">
        You currently perform fuel Delivery
      </p>
       <Image
              src={delivery} // Use the imported image
              alt="Description of my image"
              className="mb-4"
            />
    </div>
  );
}
