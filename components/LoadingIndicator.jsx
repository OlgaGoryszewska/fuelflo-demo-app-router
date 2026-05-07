'use client';

export default function LoadingIndicator() {
  return (
    <div className="loading-indicator-overlay">
      <div className="loading-indicator__dots">
        <span className="loading-indicator__dot" />
        <span className="loading-indicator__dot" />
        <span className="loading-indicator__dot" />
      </div>
    </div>
  );
}
