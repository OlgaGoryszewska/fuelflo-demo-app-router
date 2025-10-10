import Link from 'next/link';

export default function IntroAddFuelDelivery() {
  return (
    <div className="main-container">
      <form className="pt-2">
        <div className="flex justify-end ">
          <span className="material-symbols-outlined big justify-center ">
            close
          </span>
        </div>
        <img src="/meter-blob.png" alt="main page image" />
        <div className="m-4 ">
          <p className="mb-4">Follow 5 steps tank refill evidence collection</p>
          <p className="mb-4">1. Fill up Setup Form</p>
          <p className="mb-4">2. Take a picture at the starting meter point</p>
          <p className="mb-4">3. Enter the reading by scan or manually</p>
          <p className="mb-4">4. Take a picture after refill of the tank</p>
          <p className="mb-4">
            5. Enter the reading by scan or manually after refilling a tank
          </p>
          <button className="button-big ">
            <Link href="/add-fuel-delivery">Get Started</Link>
          </button>
        </div>
      </form>
    </div>
  );
}
