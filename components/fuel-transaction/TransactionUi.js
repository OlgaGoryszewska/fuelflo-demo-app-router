export function TransactionStepHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <p className="steps-text mb-2 uppercase tracking-[0.18em]">
          {eyebrow}
        </p>
      )}
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
    <section className="rounded-[24px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)]">
      <div className="mb-4 flex items-start gap-3">
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
            <Icon size={20} strokeWidth={2.25} />
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--primary-black)]">
            {title}
          </p>
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
    <p className="mb-4 rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
      {children}
    </p>
  );
}

export function TransactionReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#edf1f5] py-3 last:border-b-0">
      <p className="text-sm text-[#717887]">{label}</p>
      <p className="max-w-[65%] text-right text-sm font-semibold text-gray-900">
        {value || 'Missing'}
      </p>
    </div>
  );
}
