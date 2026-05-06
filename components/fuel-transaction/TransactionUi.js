export function TransactionStepHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-4">
      <div className="form-header-steps mb-3">
        <p className="steps-text pr-2">{eyebrow}</p>
      </div>
      <h2>{title}</h2>
      {description && <p className="steps-text mt-1">{description}</p>}
    </div>
  );
}

export function TransactionFieldCard({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
            <Icon size={21} strokeWidth={2.2} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {description && <p className="steps-text mt-1">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function TransactionValidationMessage({ children }) {
  if (!children) return null;

  return (
    <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
      {children}
    </p>
  );
}

export function TransactionReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 py-3 last:border-b-0">
      <p className="text-sm text-[#717887]">{label}</p>
      <p className="max-w-[65%] text-right text-sm font-semibold text-gray-900">
        {value || 'Missing'}
      </p>
    </div>
  );
}
