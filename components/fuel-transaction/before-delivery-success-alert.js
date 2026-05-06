'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import refil from '@/public/refil.png';

export default function BeforeDeliverySuccessAlert({
  projectId,
  transactionId,
  isOffline,
}) {
  const router = useRouter();
  return (
    <div className="background-container-white">
      <div className="mt-4 m-auto flex flex-col justyfy-center">
        <div className="grid grid-flow-row justify-items-center ">
          <h2 className="">Congratulations!</h2>
          <p>Before evidence saved</p>
          <Image
            className="h-28 w-28 m-auto"
            src={refil}
            alt="fuer feril icon"
          />
          <div className="divider-full "></div>
          <p className="h-mid-gray-s my-4 text-center ">
            Now complete the delivery or return, then capture the after meter
            evidence.
          </p>
          {isOffline && (
            <p className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-center text-sm text-yellow-800">
              Saved offline. The after evidence will stay linked to this
              transaction and sync later.
            </p>
          )}
        </div>
      </div>
      <button
        className="button-big"
        onClick={() =>
          router.push(
            `/resources/projects/${projectId}/transactions/${transactionId}/after/`
          )
        }
      >
        Collect after evidence
      </button>
    </div>
  );
}
