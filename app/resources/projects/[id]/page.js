'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCent,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Fuel,
  Gauge,
  Lightbulb,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  Truck,
  UserRound,
  UsersRound,
  Zap,
} from 'lucide-react';
import ProjectFuelTransactionList from '@/components/ProjectFuelTransactionList';
import LoadingIndicator from '@/components/LoadingIndicator';
import formatDateShort from '@/components/FormatDateShort';
import { supabase } from '@/lib/supabaseClient';
import { getCurrentProfileRole } from '@/lib/auth/currentProfileRole';

const PROJECT_EDIT_ROLES = new Set(['manager', 'hire_desk']);

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatLitres(value) {
  return `${toNumber(value).toFixed(0)} L`;
}

function formatMoney(value) {
  return `${toNumber(value).toFixed(2)} SAR`;
}

function formatPrice(value) {
  return `${toNumber(value).toFixed(2)} SAR/L`;
}

function percent(value) {
  return `${toNumber(value).toFixed(0)}%`;
}

function shortId(value) {
  return value ? `${String(value).slice(0, 8)}...` : 'Not assigned';
}

function MetricCard({ icon: Icon, label, value, hint, tone = 'slate' }) {
  const tones = {
    orange: 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]',
    green: 'bg-[#f3fbef] text-[#2f8f5b] ring-[#d7edce]',
    amber: 'bg-[#fff7e6] text-[#9a5f12] ring-[#fee39f]',
    slate: 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]',
  };

  return (
    <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4 shadow-[0_4px_12px_rgba(98,116,142,0.06)]">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ring-1 ${tones[tone]}`}
      >
        <Icon size={20} strokeWidth={2.3} />
      </div>
      <p className="text-xl font-semibold text-[var(--primary-black)]">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#62748e]">{label}</p>
      {hint && <p className="steps-text mt-1">{hint}</p>}
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && <p className="page-kicker">{eyebrow}</p>}
        <h2 className="mt-1">{title}</h2>
        {description && <p className="steps-text mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href }) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
        <Icon size={17} strokeWidth={2.2} />
      </span>
      <span className="min-w-0">
        <span className="steps-text block">{label}</span>
        <span className="block truncate text-sm font-semibold text-[var(--primary-black)]">
          {value || 'Missing'}
        </span>
      </span>
    </>
  );

  if (href && value) {
    return (
      <Link href={href} className="flex items-center gap-3 py-2">
        {content}
      </Link>
    );
  }

  return <div className="flex items-center gap-3 py-2">{content}</div>;
}

function PersonCard({ title, person, emptyText }) {
  return (
    <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
          <UserRound size={20} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <p className="steps-text">{title}</p>
          <p className="truncate text-sm font-semibold text-[var(--primary-black)]">
            {person?.full_name || person?.name || emptyText}
          </p>
        </div>
      </div>
      {person?.email && (
        <ContactRow
          icon={Mail}
          label="Email"
          value={person.email}
          href={`mailto:${person.email}`}
        />
      )}
      {person?.phone && (
        <ContactRow
          icon={Phone}
          label="Phone"
          value={person.phone}
          href={`tel:${person.phone}`}
        />
      )}
    </div>
  );
}

function TipCard({ icon: Icon, title, description, tone = 'slate' }) {
  const tones = {
    orange: 'bg-[#fff7e6] text-[#f25822] ring-[#fee39f]',
    green: 'bg-[#f3fbef] text-[#2f8f5b] ring-[#d7edce]',
    amber: 'bg-[#fff7e6] text-[#9a5f12] ring-[#fee39f]',
    slate: 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]',
  };

  return (
    <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4">
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${tones[tone]}`}
        >
          <Icon size={19} strokeWidth={2.3} />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--primary-black)]">
            {title}
          </p>
          <p className="steps-text mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

function FuelVarianceCard({
  deliveredLitres,
  returnedLitres,
  expectedLitres,
  netUsedLitres,
  missingLitres,
}) {
  const hasExpected = expectedLitres > 0;
  const needsReview = missingLitres > 0;

  const columns = [
    {
      label: 'Delivered',
      value: formatLitres(deliveredLitres),
      tone: 'text-[#f25822]',
    },
    {
      label: 'Returned',
      value: formatLitres(returnedLitres),
      tone: 'text-[#62748e]',
    },
    {
      label: 'Expected',
      value: hasExpected ? formatLitres(expectedLitres) : 'Missing',
      tone: 'text-[var(--primary-black)]',
    },
    {
      label: 'Unaccounted',
      value: formatLitres(missingLitres),
      tone: needsReview ? 'text-[#9a5f12]' : 'text-[#2f8f5b]',
    },
  ];

  return (
    <div
      className={`rounded-[24px] border p-4 ${
        needsReview
          ? 'border-[#fee39f] bg-[#fff7e6]'
          : 'border-[#d7edce] bg-[#f3fbef]'
      }`}
    >
      <div className="mb-4 flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ${
            needsReview ? 'text-[#9a5f12]' : 'text-[#2f8f5b]'
          }`}
        >
          {needsReview ? (
            <AlertTriangle size={20} strokeWidth={2.3} />
          ) : (
            <CheckCircle2 size={20} strokeWidth={2.3} />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--primary-black)]">
            Fuel variance
          </p>
          <p className="steps-text mt-1">
            {hasExpected
              ? needsReview
                ? `${formatLitres(
                    missingLitres
                  )} sits above expected use and needs review.`
                : 'Delivered, returned, and expected use are balanced.'
              : 'Add expected litres to calculate missing fuel.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {columns.map((column) => (
          <div
            key={column.label}
            className="rounded-[18px] border border-white/70 bg-white/80 p-3"
          >
            <p className="steps-text">{column.label}</p>
            <p className={`mt-1 text-sm font-semibold ${column.tone}`}>
              {column.value}
            </p>
          </div>
        ))}
      </div>

      <p className="steps-text mt-3">
        Net used {formatLitres(netUsedLitres)}
      </p>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id: projectId } = useParams();
  const [fuelSummary, setFuelSummary] = useState(null);
  const [project, setProject] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [fleetRows, setFleetRows] = useState([]);
  const [pendingEvidenceCount, setPendingEvidenceCount] = useState(0);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;

    async function loadProjectDashboard() {
      setLoading(true);
      setError('');

      const idValue = isNaN(Number(projectId)) ? projectId : Number(projectId);

      try {
        const [currentRole, projectResult] = await Promise.all([
          getCurrentProfileRole(),
          supabase
            .from('projects')
            .select(
              `
            id,
            name,
            location,
            start_date,
            end_date,
            contractor_name,
            contractor_address,
            email,
            mobile,
            amount,
            selling_price,
            specification,
            additional,
            company_name,
            expected_liters,
            fuel_suppliers_id,
            active,
            manager_id,
            manager:profiles!projects_manager_id_fkey (
              id,
              full_name,
              role,
              email,
              phone
            )
          `
            )
            .eq('id', idValue)
            .single(),
        ]);
        const { data: projectData, error: projectError } = projectResult;

        if (projectError) throw projectError;
        setRole(currentRole);

        const [
          fuelSummaryResult,
          technicianResult,
          fleetResult,
          pendingResult,
        ] = await Promise.all([
          supabase
            .from('project_fuel_summary')
            .select('*')
            .eq('project_id', idValue)
            .maybeSingle(),
          supabase
            .from('profiles_projects')
            .select(
              `
              profiles_id,
              profiles:profiles_projects_profiles_id_fkey (
                id,
                full_name,
                role,
                email,
                phone
              )
            `
            )
            .eq('projects_id', idValue),
          supabase
            .from('generators_tanks')
            .select(
              `
              id,
              project_id,
              generator_id,
              generator_name,
              tank_id,
              tank_name
            `
            )
            .eq('project_id', idValue),
          supabase
            .from('fuel_transactions')
            .select('id', { count: 'exact', head: true })
            .eq('project_id', idValue)
            .or('after_photo_url.is.null,after_fuel_level.is.null'),
        ]);

        if (fuelSummaryResult.error) throw fuelSummaryResult.error;
        if (technicianResult.error) throw technicianResult.error;
        if (fleetResult.error) throw fleetResult.error;
        if (pendingResult.error) throw pendingResult.error;

        let supplierData = null;

        if (projectData.fuel_suppliers_id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, role, email, phone')
            .eq('id', projectData.fuel_suppliers_id)
            .maybeSingle();

          if (!error) {
            supplierData = data;
          }
        }

        setProject(projectData);
        setFuelSummary(fuelSummaryResult.data);
        setSupplier(supplierData);
        setTechnicians(
          (technicianResult.data || [])
            .map((item) => item.profiles)
            .filter(Boolean)
        );
        setFleetRows(fleetResult.data || []);
        setPendingEvidenceCount(pendingResult.count || 0);
      } catch (err) {
        console.error('Error loading project dashboard:', err);
        setError(err.message || 'Failed to load project details');
        setProject(null);
        setFuelSummary(null);
        setSupplier(null);
        setTechnicians([]);
        setFleetRows([]);
        setPendingEvidenceCount(0);
      } finally {
        setLoading(false);
      }
    }

    loadProjectDashboard();
  }, [projectId]);

  const fleet = useMemo(() => {
    const grouped = {};

    for (const row of fleetRows) {
      const key = String(row.generator_id || row.generator_name || row.id);

      if (!grouped[key]) {
        grouped[key] = {
          id: row.generator_id,
          name: row.generator_name || 'Unnamed generator',
          tanks: [],
        };
      }

      if (row.tank_id || row.tank_name) {
        grouped[key].tanks.push({
          id: row.tank_id,
          name: row.tank_name || 'Unnamed tank',
        });
      }
    }

    return Object.values(grouped);
  }, [fleetRows]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-3 py-4">
        <div className="rounded-[24px] border border-[#fee39f] bg-[#fff7e6] p-4 text-sm text-[#9a5f12]">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-3 py-4">
        <div className="rounded-[24px] border border-[#e8edf3] bg-white/80 p-4">
          <p className="steps-text">Project not found.</p>
        </div>
      </div>
    );
  }

  const deliveredLitres = toNumber(fuelSummary?.total_delivered_litres);
  const returnedLitres = toNumber(fuelSummary?.total_returned_litres);
  const netUsedLitres = toNumber(fuelSummary?.net_used_litres);
  const purchasePrice = toNumber(project.amount);
  const sellingPrice = toNumber(project.selling_price);
  const marginPerLiter = sellingPrice - purchasePrice;
  const expectedLitres = toNumber(project.expected_liters);
  const missingLitres =
    expectedLitres > 0 ? Math.max(netUsedLitres - expectedLitres, 0) : 0;
  const actualRevenue = netUsedLitres * sellingPrice;
  const deliveredCost = deliveredLitres * purchasePrice;
  const grossMargin = actualRevenue - deliveredCost;
  const expectedMargin = expectedLitres * marginPerLiter;
  const expectedVarianceLitres =
    expectedLitres > 0 ? netUsedLitres - expectedLitres : 0;
  const returnRate =
    deliveredLitres > 0 ? (returnedLitres / deliveredLitres) * 100 : 0;
  const uplift025 = netUsedLitres * 0.25;
  const uplift050 = netUsedLitres * 0.5;
  const marginTone =
    marginPerLiter > 0 ? 'green' : marginPerLiter < 0 ? 'amber' : 'slate';
  const mapsHref = project.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        project.location
      )}`
    : '';
  const canEditProject = PROJECT_EDIT_ROLES.has(role);

  const tips = [
    returnRate > 15
      ? {
          icon: RotateCcw,
          title: 'Returns are high',
          description: `${percent(returnRate)} of delivered fuel came back. Use smaller staged deliveries on the next run to reduce tied-up fuel and transport time.`,
          tone: 'amber',
        }
      : {
          icon: ShieldCheck,
          title: 'Return rate looks controlled',
          description:
            'Returned fuel is not dominating the job. Keep using meter evidence to protect the margin.',
          tone: 'green',
        },
    pendingEvidenceCount > 0
      ? {
          icon: AlertTriangle,
          title: 'Close pending evidence',
          description: `${pendingEvidenceCount} transaction${
            pendingEvidenceCount === 1 ? '' : 's'
          } still need after evidence. Closing them protects billing and avoids disputed litres.`,
          tone: 'amber',
        }
      : {
          icon: CheckCircle2,
          title: 'Evidence is clean',
          description:
            'All current transactions have after evidence, so this project is stronger for reporting and billing.',
          tone: 'green',
        },
    {
      icon: CircleDollarSign,
      title: 'Price uplift opportunity',
      description: `A 0.25 SAR/L uplift on current net use adds ${formatMoney(
        uplift025
      )}. A 0.50 SAR/L uplift adds ${formatMoney(uplift050)}.`,
      tone: 'orange',
    },
    expectedLitres > 0
      ? {
          icon: Gauge,
          title:
            expectedVarianceLitres > 0
              ? 'Usage is above estimate'
              : 'Usage is within estimate',
          description: `${formatLitres(Math.abs(expectedVarianceLitres))} ${
            expectedVarianceLitres > 0 ? 'over' : 'under'
          } expected use. Requote future events with this variance in mind.`,
          tone: expectedVarianceLitres > 0 ? 'amber' : 'green',
        }
      : {
          icon: Lightbulb,
          title: 'Add expected litres',
          description:
            'Expected litres unlock forecast margin, variance, and better pricing decisions for similar events.',
          tone: 'slate',
        },
  ];

  return (
    <div className="mx-auto w-full max-w-[640px] px-3 py-4">
      <div className="mb-3 px-1">
        <p className="page-kicker">Project operations</p>
      </div>

      <section className="relative mb-4 overflow-hidden rounded-[28px] border border-[#f6d78c] bg-gradient-to-br from-white via-[#fff8ea] to-[#fee39f] p-5 shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/45" />
        <div className="pointer-events-none absolute -bottom-24 left-8 h-44 w-44 rounded-full bg-[#ff8a00]/10" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="steps-text uppercase tracking-[0.18em]">
              Event fuel dashboard
            </p>
            <h2 className="mt-2 truncate">
              {project.name || 'Unnamed project'}
            </h2>
            <p className="steps-text mt-1">
              {project.active ? 'Active project' : 'Inactive project'}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
              project.active
                ? 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]'
                : 'border-[#e8edf3] bg-white/80 text-[#717887]'
            }`}
          >
            {project.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="relative mt-6 grid grid-cols-1 gap-3">
          {project.location && (
            <Link
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-[20px] border border-white/70 bg-white/70 p-3 active:scale-[0.98]"
            >
              <MapPin className="shrink-0 text-[#f25822]" size={20} />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--primary-black)]">
                {project.location}
              </span>
              <ArrowRight className="shrink-0 text-[#62748e]" size={17} />
            </Link>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[20px] border border-white/70 bg-white/70 p-3">
              <p className="steps-text flex items-center gap-2">
                <CalendarDays size={16} />
                Starts
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--primary-black)]">
                {formatDateShort(project.start_date)}
              </p>
            </div>
            <div className="rounded-[20px] border border-white/70 bg-white/70 p-3">
              <p className="steps-text flex items-center gap-2">
                <CalendarDays size={16} />
                Ends
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--primary-black)]">
                {formatDateShort(project.end_date)}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`relative mt-5 grid gap-3 ${
            canEditProject ? 'grid-cols-2' : 'grid-cols-1'
          }`}
        >
          <Link
            href={`/resources/projects/${projectId}/new`}
            className="button-big mb-0 justify-center gap-2 text-white"
          >
            <Plus size={18} />
            Transaction
          </Link>
          {canEditProject && (
            <Link
              href={`/resources/projects/${projectId}/edit`}
              className="button-big mb-0 justify-center gap-2"
            >
              <Pencil size={18} />
              Edit
            </Link>
          )}
        </div>
      </section>

      <ProjectFuelTransactionList projectId={projectId} />

      <section className="background-container mb-4">
        <SectionHeader
          eyebrow="Fuel control"
          title="Live fuel position"
          description="Delivered, returned, and actually used fuel for this event."
        />
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={Fuel}
            label="Delivered"
            value={formatLitres(deliveredLitres)}
            tone="orange"
          />
          <MetricCard
            icon={RotateCcw}
            label="Returned"
            value={formatLitres(returnedLitres)}
          />
          <MetricCard
            icon={Gauge}
            label="Net used"
            value={formatLitres(netUsedLitres)}
            hint="Billable fuel basis"
            tone="green"
          />
          <MetricCard
            icon={AlertTriangle}
            label="Pending evidence"
            value={pendingEvidenceCount}
            hint="Needs after proof"
            tone={pendingEvidenceCount > 0 ? 'amber' : 'green'}
          />
        </div>
        <div className="mt-3">
          <FuelVarianceCard
            deliveredLitres={deliveredLitres}
            returnedLitres={returnedLitres}
            expectedLitres={expectedLitres}
            netUsedLitres={netUsedLitres}
            missingLitres={missingLitres}
          />
        </div>
      </section>

      <section className="background-container mb-4">
        <SectionHeader
          eyebrow="Margin"
          title="Fuel financials"
          description="Pricing, margin, and earning opportunity for this project."
        />
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={Truck}
            label="Buy price"
            value={formatPrice(purchasePrice)}
          />
          <MetricCard
            icon={BadgeCent}
            label="Sell price"
            value={formatPrice(sellingPrice)}
            tone="orange"
          />
          <MetricCard
            icon={CircleDollarSign}
            label="Margin per litre"
            value={formatPrice(marginPerLiter)}
            tone={marginTone}
          />
          <MetricCard
            icon={ShieldCheck}
            label="Gross margin"
            value={formatMoney(grossMargin)}
            hint={`Revenue ${formatMoney(actualRevenue)}`}
            tone={grossMargin > 0 ? 'green' : 'amber'}
          />
          <MetricCard
            icon={Gauge}
            label="Expected litres"
            value={
              expectedLitres > 0 ? formatLitres(expectedLitres) : 'Missing'
            }
          />
          <MetricCard
            icon={CircleDollarSign}
            label="Expected margin"
            value={expectedLitres > 0 ? formatMoney(expectedMargin) : 'Missing'}
            tone={expectedMargin > 0 ? 'green' : 'slate'}
          />
        </div>
      </section>

      <section className="background-container-white mb-4">
        <SectionHeader
          eyebrow="Savings"
          title="Money and time tips"
          description="Actionable checks based on current fuel, pricing, and evidence."
        />
        <div className="grid grid-cols-1 gap-3">
          {tips.map((tip) => (
            <TipCard
              key={tip.title}
              icon={tip.icon}
              title={tip.title}
              description={tip.description}
              tone={tip.tone}
            />
          ))}
        </div>
      </section>

      <section className="background-container-white mb-4">
        <SectionHeader
          eyebrow="Fleet"
          title="Generators and tanks"
          description="Equipment assigned to the event fuel operation."
        />

        {fleet.length === 0 ? (
          <div className="rounded-[22px] border border-[#e8edf3] bg-white p-4">
            <p className="steps-text">No generators connected.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {fleet.map((generator) => (
              <div
                key={`${generator.id || generator.name}`}
                className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                    <Zap size={20} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--primary-black)]">
                      {generator.name}
                    </p>
                    <p className="steps-text">
                      {(generator.tanks || []).length} assigned tank
                      {(generator.tanks || []).length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                {(generator.tanks || []).length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {generator.tanks.map((tank) => (
                      <span
                        key={`${generator.id}-${tank.id || tank.name}`}
                        className="rounded-full border border-[#d5eefc] bg-[#f5fbff] px-3 py-1 text-xs font-semibold text-[#62748e]"
                      >
                        {tank.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="steps-text mt-3">No tanks assigned.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="background-container-white mb-4">
        <SectionHeader
          eyebrow="People"
          title="Team and partners"
          description="Manager, technicians, event organizer, and fuel supplier."
        />

        <div className="grid grid-cols-1 gap-3">
          <PersonCard
            title="Manager"
            person={project.manager}
            emptyText="No manager assigned"
          />

          <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc]">
                <UsersRound size={20} strokeWidth={2.2} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--primary-black)]">
                  Technicians
                </p>
                <p className="steps-text">{technicians.length} assigned</p>
              </div>
            </div>
            {technicians.length > 0 ? (
              <div className="divide-y divide-[#edf1f5]">
                {technicians.map((tech) => (
                  <div key={tech.id} className="py-2">
                    <p className="text-sm font-semibold text-[var(--primary-black)]">
                      {tech.full_name || 'Unnamed technician'}
                    </p>
                    <p className="steps-text">
                      {tech.email || tech.phone || tech.role}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="steps-text">No technicians assigned.</p>
            )}
          </div>

          <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4">
            <p className="text-sm font-semibold text-[var(--primary-black)]">
              Event organizer
            </p>
            <p className="steps-text mt-1">
              {project.contractor_name || 'No organizer contact'}
            </p>
            <ContactRow
              icon={UsersRound}
              label="Company"
              value={project.company_name}
            />
            <ContactRow
              icon={MapPin}
              label="Address"
              value={project.contractor_address}
            />
            <ContactRow
              icon={Mail}
              label="Email"
              value={project.email}
              href={`mailto:${project.email}`}
            />
            <ContactRow
              icon={Phone}
              label="Phone"
              value={project.mobile}
              href={`tel:${project.mobile}`}
            />
          </div>

          <PersonCard
            title="Fuel supplier"
            person={supplier}
            emptyText={
              project.fuel_suppliers_id
                ? shortId(project.fuel_suppliers_id)
                : 'No supplier assigned'
            }
          />
        </div>
      </section>

      <section className="background-container-white mb-4">
        <SectionHeader
          eyebrow="Notes"
          title="Project notes"
          description="Operational notes captured during setup."
          action={
            canEditProject ? (
              <Link
                href={`/resources/projects/${projectId}/edit`}
                className="circle-btn shrink-0 text-[#62748e]"
                title="Edit project notes"
              >
                <Pencil size={15} strokeWidth={2.2} />
              </Link>
            ) : null
          }
        />

        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-[22px] border border-[#e8edf3] bg-white/85 p-4">
            <p className="steps-text">Specification</p>
            <p className="mt-1 text-sm font-semibold text-[var(--primary-black)]">
              {project.specification || 'No project specification added yet.'}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#fee39f] bg-[#fff7e6] p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#f25822] ring-1 ring-[#fee39f]">
                <Lightbulb size={19} strokeWidth={2.3} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--primary-black)]">
                  Additional note
                </p>
                <p className="steps-text mt-1">
                  {project.additional ||
                    'Add supplier access notes, delivery constraints, gate instructions, or anything the field team should know before dispatch.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {project.location && (
        <section className="background-container-white mb-4 overflow-hidden">
          <SectionHeader
            eyebrow="Location"
            title="Event map"
            description="Open this in maps before dispatching supplier or technicians."
          />
          <iframe
            title="Project location map"
            className="h-64 w-full rounded-[22px] border border-[#e8edf3]"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              project.location
            )}&output=embed`}
            allowFullScreen
          />
        </section>
      )}
    </div>
  );
}
