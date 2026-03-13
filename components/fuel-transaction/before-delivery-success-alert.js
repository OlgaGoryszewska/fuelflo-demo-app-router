'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import refil from '@/public/refil.png';

export default function BeforeDeliverySuccessAlert({ projectId }) {
  const router = useRouter();
  return (
    <div className="background-container-white">
      <div className="mt-4 m-auto flex flex-col justyfy-center">
        <div className="grid grid-flow-row justify-items-center ">
          <h2 className="">Congratulations!</h2>
          <p>Data delivered successfuly</p>
          <Image
            className="h-28 w-28 m-auto"
            src={refil}
            alt="fuer feril icon"
          />
          <div className="divider-full "></div>
          <p className="h-mid-gray-s my-4 text-center ">
            Now you can refill a tank
          </p>
        </div>
      </div>
      <button
        className="button-big"
        onClick={() =>
          router.push(`/resources/transactions/${projectId}/after/`)
        }
      >
        Collect data after delivery
      </button>
    </div>
  );
}
