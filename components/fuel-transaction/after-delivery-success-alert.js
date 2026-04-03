'use client';

import Image from 'next/image';
import success from '@/public/success.png';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AfterDeliverySuccessAlert() {
  const params = useParams();
  const projectId = params.id;
  const transactionId = params.transactionId;
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

          <Link
            href={`/resources/projects/${projectId}/transactions/${transactionId}/`}
          >
            <p className="h-mid-gray-s my-4 underline ">
              Click to see transaction details{' '}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
