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
        {roleBlocks.map((roleBlock) => (
          <div
            key={roleBlock.title}
            className="border border-gray-300 rounded-lg p-4 mb-2 w-full max-w-md shadow-md "
          >
            <h3 className="text-2xl mb-2">{roleBlock.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
