'use client';

import Image from 'next/image';
import success from '@/public/success.png';
import Link from 'next/link';

export default function AfterDeliverySuccessAlert() {
  return (
    <div className="background-container-white">
    <div className="mt-4 m-auto flex flex-col justyfy-center">
      <div className="grid grid-flow-row justify-items-center ">
        <h2 className="">Congratulations!</h2>
        <p>Data delivered successfuly</p>
        <Image
          className="h-28 w-28 m-auto"
          src={success}
          alt="fuer feril icon"
        />
        <div className="divider-full "></div>
        <p className="h-mid-gray-s my-4 ">Click to see transaction in </p>
        <Link className="h-mid-gray-s underline" href="/resources/transactions">
          transactions section
        </Link>
      </div>
    </div>
    </div>
  );
}
