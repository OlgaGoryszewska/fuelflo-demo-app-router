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
          <p className="mt-2 mb-2">Transaction evidence complete</p>
          <Image
            className="h-28 w-28 m-auto mb-2"
            src={success}
            alt="fuer feril icon"
          />
          <div className="divider-full mb-4 "></div>
          <button className="button-big">
            <Link
              href={`/resources/projects/${projectId}/transactions/${transactionId}/`}
            >
              Transaction details
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
