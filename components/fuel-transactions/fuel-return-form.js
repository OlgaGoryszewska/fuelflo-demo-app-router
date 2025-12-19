'use client';
import Image from 'next/image';
import returnImage from '@/public/return.png';

export default function FuelReturnForm() {
  return (
    <div>
      <p className="mb-4 font-medium text-center ">
        You currently perform fuel Return
      </p>
       <Image
              src={returnImage} // Use the imported image
              alt="Description of my image"
              className="mb-4"
            />
    </div>
  );
}
