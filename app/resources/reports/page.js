import Image from 'next/image';
import register from '@/public/register.png';
import listBlob from '@/public/list-blob.png';
import Link from 'next/link';

export default function AddEquipment() {
  return (
    <div className="main-container ">
      <h1 className="uppercase mb-2 ">Generate report</h1>
      <div className="flex flex-row gap-4">
        <Link
          href="/resources/reports/fuel-transactions"
          className="background-container-white flex align-middle align-center "
        >
          <Image src={register} alt="tank image" className="w-20 h-20 m-auto" />
          <div className="">
            <div className="divider-full mb-2"></div>
            <p className="h-mid-gray-s ">Fuel Transaction</p>
            <p className="steps-text ">Choose transaction to create a raport</p>
          </div>
        </Link>
        <Link
          href="/resources/reports/projects"
          className="background-container-white flex align-middle align-center border border-transparent hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 rounded-xl cursor-pointer "
        >
          <Image src={listBlob} alt="gen image" className="w-20 h-20 m-auto" />
          <div className="">
            <div className="divider-full mb-2"></div>
            <p className="h-mid-gray-s ">Project</p>
            <p className="steps-text ">
              Choose the project to generate the raport
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
