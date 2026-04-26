import Image from 'next/image';
import tank from '@/public/tank.png';
import generator from '@/public/generator.png';
import Link from 'next/link';

export default function AddEquipment() {
  return (
    <div className="main-container ">
      <h1 className="uppercase mb-2 ">Add eguipment</h1>
      <div className="flex flex-row gap-4">
        <Link
          href="/add-forms/add_equipment/external-tank"
          className="background-container-white flex align-middle align-center "
        >
          <Image src={tank} alt="tank image" className="w-20 h-20 m-auto" />
          <div className="">
            <div className="divider-full mb-2"></div>
            <p className="h-mid-gray-s ">Add tank</p>
            <p className="steps-text ">Add external tank to the system</p>
          </div>
        </Link>
        <Link
          href="/add-forms/add_equipment/generator"
          className="background-container-white flex align-middle align-center border border-transparent hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 rounded-xl cursor-pointer "
        >
          <Image src={generator} alt="gen image" className="w-20 h-20 m-auto" />
          <div className="">
            <div className="divider-full mb-2"></div>
            <p className="h-mid-gray-s ">Add generator</p>
            <p className="steps-text ">Add generator to the system</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
