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
      <button className="button-big-border-orange mb-4 ">
        <span className="material-symbols-outlined black pr-2">qr_code</span>
        Skan Generator QR Code
      </button>

      <div className="flex flex-col items-center">
        <h3 className="delivery ">or</h3>

        <input
          className="input-gray"
          type="text"
          placeholder="Search by name..."
        />
      </div>
    </div>
  );
}
