import Image from 'next/image';
import login from '@/public/login.png';
export default function Home() {
  return (
    <div className="main-container">
      <div className="background-container-white ">
        <Image src={login} alt="welcome img" className="w-32 mx-auto" />
        <h2 className="mx-auto">Login to Fuelflo as a</h2>
        <button
          className="button-big my-4
      "
        >
          Manager
        </button>
        <button
          className="button-big my-4
      "
        >
        Hire Desk
        </button>
        <button
          className="button-big my-4
      "
        >
          Technician
        </button>
        <h4>Don’t have an account? Contact Hire Desk.</h4>
      </div>

      
    </div>
  );
}
