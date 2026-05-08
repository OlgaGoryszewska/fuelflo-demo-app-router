import Link from 'next/link';
import {
  ArrowRight,
  ClipboardList,
  FileDown,
  Fuel,
  Gauge,
} from 'lucide-react';

const reportTypes = [
  {
    href: '/resources/reports/fuel-transactions',
    title: 'Fuel transaction',
    description: 'Single delivery or return report with evidence photos.',
    icon: Fuel,
    stats: 'Single PDF',
    tone: 'orange',
  },
  {
    href: '/resources/reports/projects',
    title: 'Project report',
    description: 'Project fuel position, transactions, and financial summary.',
    icon: ClipboardList,
    stats: 'View or PDF',
    tone: 'blue',
  },
];

function toneClasses(tone) {
  if (tone === 'orange') {
    return 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]';
  }

  return 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]';
}

export default function ReportsPage() {
  return (
    <main className="mx-auto w-full max-w-[760px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Reports</p>
      </div>

      <section className="mb-4 rounded-[28px] border border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fee39f] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">
              Report workspace
            </p>
            <h2 className="mt-2">Fuel reports</h2>
            <p className="steps-text mt-1 max-w-[520px]">
              Create client-ready fuel transaction and project reports from the
              records already captured in FuelFlo.
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#f25822] ring-1 ring-white">
            <FileDown size={23} strokeWidth={2.4} />
          </span>
        </div>
      </section>

      <section className="background-container-white mb-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="page-kicker">Choose report</p>
            <h2 className="mt-1">Report type</h2>
          </div>
          <Gauge className="text-[#62748e]" size={22} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {reportTypes.map((report) => {
            const Icon = report.icon;

            return (
              <Link
                key={report.href}
                href={report.href}
                className="group rounded-[22px] border border-[#e8edf3] bg-white p-4 shadow-[0_4px_12px_rgba(98,116,142,0.08)] transition active:scale-[0.98]"
              >
                <span
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ring-1 ${toneClasses(
                    report.tone
                  )}`}
                >
                  <Icon size={21} strokeWidth={2.3} />
                </span>
                <span className="block text-base font-semibold text-[var(--primary-black)]">
                  {report.title}
                </span>
                <span className="steps-text mt-1 block">
                  {report.description}
                </span>
                <span className="mt-4 flex items-center justify-between border-t border-[#eef2f7] pt-3">
                  <span className="rounded-full bg-[#f5fbff] px-3 py-1 text-xs font-semibold text-[#62748e]">
                    {report.stats}
                  </span>
                  <ArrowRight
                    className="text-[#aab6c3] transition group-active:translate-x-1"
                    size={18}
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
