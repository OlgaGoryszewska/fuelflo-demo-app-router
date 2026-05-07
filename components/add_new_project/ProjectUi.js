export function ProjectStepHeader({ eyebrow, title, description }) {
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

export function ProjectFieldCard({
  icon: Icon,
  title,
  description,
  children,
  tone = 'slate',
}) {
  const tones = {
    amber: 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]',
    green: 'bg-[#f3fbef] text-[#2f8f5b] ring-[#d7edce]',
    slate: 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]',
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {(Icon || title || description) && (
        <div className="mb-3 flex items-start gap-3">
          {Icon && (
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${tones[tone]}`}
            >
              <Icon size={20} strokeWidth={2.2} />
            </span>
          )}
          <div className="min-w-0">
            {title && (
              <h3 className="text-base font-semibold text-gray-900">
                {title}
              </h3>
            )}
            {description && <p className="steps-text mt-1">{description}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

export function ProjectNoteCard({ icon: Icon, title, children, tone = 'amber' }) {
  return (
    <ProjectFieldCard icon={Icon} title={title} tone={tone}>
      <p className="steps-text">{children}</p>
    </ProjectFieldCard>
  );
}
