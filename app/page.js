'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  CheckCircle2,
  Clock,
  Fuel,
  Zap,
  Truck,
  Users,
  Shield,
  Camera,
  Smartphone,
  ArrowRight,
  Star,
  Award,
  Target
} from 'lucide-react';
import AuthForm from '@/components/AuthForm';
import InstallAppCard from '@/components/InstallAppCard';
import LoadingIndicator from '@/components/LoadingIndicator';

const benefits = [
  {
    title: 'Offline-ready field work',
    description:
      'Record deliveries, capture photos, and submit fuel checks even without signal.',
    icon: Smartphone,
    image: '/transaction.png',
  },
  {
    title: 'Fast crew coordination',
    description:
      'Assign projects, track tasks, and keep teams aligned from site to office.',
    icon: Users,
    image: '/project.png',
  },
  {
    title: 'Evidence-backed transactions',
    description:
      'Save receipts, tank readings, and fuel transfers in a single audit trail.',
    icon: Shield,
    image: '/delivery.png',
  },
  {
    title: 'Role-based access',
    description:
      'Technicians, managers, suppliers and event organizers see only what matters.',
    icon: Target,
    image: '/register.png',
  },
];

const steps = [
  {
    label: '1',
    title: 'Sign in',
    description: 'Use your FuelFlo account or contact the hire desk to get access.',
    icon: CheckCircle2,
  },
  {
    label: '2',
    title: 'Choose a site',
    description: 'Open your project, select the generator or tank, and start field reporting.',
    icon: Fuel,
  },
  {
    label: '3',
    title: 'Capture fuel activity',
    description: 'Log deliveries, add images, and sync automatically when connectivity returns.',
    icon: Camera,
  },
];

const ROLE_ROUTES = {
  technician: '/operations/dashboard/technician',
  manager: '/operations/dashboard/manager',
  hire_desk: '/operations/dashboard/hire-desk',
  fuel_supplier: '/resources/profile',
  event_organizer: '/resources/profile',
};

function LandingPage() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <section className="space-y-8 rounded-[32px] bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
            {/* Hero Section with Image */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-blue-50 p-8 sm:p-12">
              <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className="space-y-6">
                  <p className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
                    Field operations made simple
                  </p>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Manage fuel deliveries, field checks, and approvals from your phone.
                  </h1>
                  <p className="text-lg leading-8 text-slate-600">
                    FuelFlo helps teams reduce delays, avoid mistakes, and keep every fuel transaction visible — even when the site is offline.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Trusted by field teams
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                      <Award className="h-4 w-4 text-blue-500" />
                      Offline-first design
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src="/welcome.png"
                    alt="FuelFlo field operations"
                    width={400}
                    height={300}
                    className="rounded-2xl shadow-lg"
                    priority
                  />
                  <div className="absolute -bottom-4 -right-4 rounded-2xl bg-white p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-slate-700">Live sync</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Image
                  src="/hello-blob.png"
                  alt="Decorative element"
                  width={80}
                  height={80}
                  className="opacity-20"
                />
              </div>
            </div>

            {/* Value Props */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Trusted for</p>
                </div>
                <p className="text-2xl font-semibold text-slate-900 mb-2">Remote crews</p>
                <p className="text-sm leading-6 text-slate-600">
                  Keep mobile teams productive with a tool built for work away from the office.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Built for</p>
                </div>
                <p className="text-2xl font-semibold text-slate-900 mb-2">Fast approvals</p>
                <p className="text-sm leading-6 text-slate-600">
                  Capture receipts, photos, and fuel activity so managers can approve with confidence.
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-5 text-white shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Speed</p>
                </div>
                <p className="text-2xl font-semibold">Instant access</p>
              </div>
              <div className="rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-5 text-white shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Camera className="h-5 w-5 text-blue-400" />
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Proof</p>
                </div>
                <p className="text-2xl font-semibold">Photo evidence</p>
              </div>
              <div className="rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-5 text-white shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Smartphone className="h-5 w-5 text-green-400" />
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Sync</p>
                </div>
                <p className="text-2xl font-semibold">Auto update</p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid gap-4 rounded-[32px] bg-slate-50 p-6 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="rounded-xl bg-slate-100 p-3 group-hover:bg-slate-200 transition-colors">
                        <benefit.icon className="h-6 w-6 text-slate-600" />
                      </div>
                      <Image
                        src={benefit.image}
                        alt=""
                        width={40}
                        height={40}
                        className="absolute -top-2 -right-2 rounded-lg shadow-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 mb-2">{benefit.title}</p>
                      <p className="text-sm leading-6 text-slate-600">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* How it works */}
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full bg-orange-100 p-2">
                  <ArrowRight className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">How onboarding works</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {steps.map((step) => (
                  <div key={step.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                        {step.label}
                      </div>
                      <step.icon className="h-5 w-5 text-slate-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mb-2">{step.title}</p>
                    <p className="text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <AuthForm />
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <InstallAppCard />
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-slate-900 px-6 py-6 text-white shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-yellow-400" />
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Customer success</p>
              </div>
              <p className="text-2xl font-semibold mb-5">Fuel teams choose FuelFlo for reliable field control.</p>
              <ul className="space-y-3 text-sm leading-6 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  Cut reconciliation time with mobile-first fuel transaction tracking.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  Reduce lost evidence with photo-backed delivery records.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  Get the right information to the right role instantly.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function LoggedInHomePage({ user, profile }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to role-specific dashboard after a brief moment
    const timer = setTimeout(() => {
      router.push(ROLE_ROUTES[profile.role] || '/resources/projects');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, profile.role]);

  return (
    <main className="bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">
            Welcome back, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Taking you to your {profile.role?.replace('_', ' ')} dashboard...
          </p>
          <LoadingIndicator />
        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);

      if (session?.user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!error && mounted) {
          setProfile(profileData);
        }
      }

      setLoading(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session?.user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (!error) {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main className="bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingIndicator />
          </div>
        </div>
      </main>
    );
  }

  if (session && profile) {
    return <LoggedInHomePage user={session.user} profile={profile} />;
  }

  return <LandingPage />;
}
