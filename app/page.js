import Image from 'next/image';
import login from '@/public/login.png';
export default function Home() {
  return (
    <div className="main-container ">
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
        <h4>You don't have account yet please contact Hire Desk</h4>
      </div>

      <div className="m-4 flex flex-col justify-center items-center ">
        <h2 className="mt-4 text-center">
          Fuel, Delivered Right — Evidence, Insight, Control
        </h2>
        <div className="body-text">
          Keep every generator running and{' '}
          <span>every litre accounted for</span>. Our app tracks fuel delivery
          and usage for large events, capturing:
          <ul>
            <li className="ml-4">photo evidence</li>
            <li className="ml-4">GPS</li>
            <li className="ml-4">timestamps</li>
          </ul>
          So managers, suppliers, and technicians stay perfectly aligned.
        </div>

        <h2 className="mt-4 text-center">
          We built Flo right into the FuelFlo Solution App
        </h2>
        <p className="body-text pt-4 ">
          so every role can work faster and with confidence. From forecasting
          and delivery proof to clean dashboards and alerts, Flo guides your
          team step-by-step and makes sure nothing slips.
        </p>

        <h2 className="text-4xl text-center pt-4">Benefits by Role</h2>
      </div>
      <div className="form-button mx-4">For Managers & Hire Desk</div>
      <div className="form-button mx-4">For Technicians</div>
      <div className="form-button mx-4">For Fuel Suppliers</div>
      <div className="form-button mx-4 ">For Event Organizers</div>
    </div>
  );
}
