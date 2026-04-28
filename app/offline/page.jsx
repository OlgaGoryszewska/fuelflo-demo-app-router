export default function OfflinePage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>You are offline</h1>

      <p>
        Flow Solution App is still available, but some data cannot sync until
        internet connection returns.
      </p>

      <p>
        Fuel evidence saved offline will stay safely on this device and can be
        synced later.
      </p>
    </main>
  );
}
