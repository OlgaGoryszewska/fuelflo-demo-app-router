export default function NotFound() {
  return (
    <div className="background-container">
      <h1 className="not-found-title">404 - Page Not Found</h1>
      <p className="not-found-message">
        The page you are looking for does not exist.
      </p>
      <a href="/" className="not-found-link">
        Go back to Home
      </a>
    </div>
  );
}
