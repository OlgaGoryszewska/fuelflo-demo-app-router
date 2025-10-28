const roleBlocks = [
  {
    title: 'For Managers & Hire Desk',
  },
  {
    title: 'For Technicians',
  },
  {
    title: 'For Fuel Suppliers',
  },
  {
    title: 'For Event Organisers',
  },
];

export default function Home() {
  return (
    <div>
      <div className="m-4 flex flex-col justify-center items-center ">
        <h2 className="text-4xl text-center">
          Fuel, Delivered Right — Evidence, Insight, Control{' '}
        </h2>
        <p className="body-text">
          Keep every generator running and every litre accounted for. Our app
          tracks fuel delivery and usage for large events—capturing photo
          evidence, GPS, and timestamps—so managers, suppliers, and technicians
          stay perfectly aligned.
        </p>

        <p className="body-text pt-4 ">
          “We built Flo right into the FuelFlo Solution App so every role can
          work faster and with confidence. From forecasting and delivery proof
          to clean dashboards and alerts, Flo guides your team step-by-step and
          makes sure nothing slips.”
        </p>
        <img src="/hello-blob.png" alt="main page image" className="pb-4 " />
        <h2 className="text-4xl text-center pt-4">Benefits by Role</h2>
        
      </div>
      <div className="form-button mx-4">For Managers & Hire Desk</div>
      <div className="form-button mx-4">For Technicians</div>
      <div className="form-button mx-4">For Fuel Suppliers</div>
      <div className="form-button mx-4">For Event Organisers</div>

    </div>
  );
}
