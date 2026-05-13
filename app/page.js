'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import {
  CheckCircle2,
  Fuel,
  Shield,
  Smartphone,
  Star,
  Award,
  Target,
  Users,
  Camera
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
  },
  {
    title: 'Fast crew coordination',
    description:
      'Assign projects, track tasks, and keep teams aligned from site to office.',
    icon: Users,
  },
  {
    title: 'Evidence-backed transactions',
    description:
      'Save receipts, tank readings, and fuel transfers in a single audit trail.',
    icon: Shield,
  },
  {
    title: 'Role-based access',
    description:
      'Technicians, managers, suppliers and event organizers see only what matters.',
    icon: Target,
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
  fuel_supplier: '/operations/dashboard/fuel_supplier',
  event_organizer: '/operations/dashboard/event_organizer',
};

function LandingPage({ showAuthActions, user, profile }) {
  const dashboardRoute = ROLE_ROUTES[profile?.role] || '/resources/projects';

  return (
    <main className="bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          {/* Main Content */}
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center lg:text-left">
              <div className="mx-auto max-w-3xl lg:mx-0">
                <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 mb-6">
                  <Award className="h-4 w-4" />
                  Field operations made simple
                </p>

                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
                  Fuel management that works
                  <span className="block text-orange-600">where you work</span>
                </h1>

                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  Track deliveries, capture evidence, and coordinate crews — even offline.
                  FuelFlo keeps your fuel operations running smoothly from site to office.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                  <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                    <CheckCircle2 className="h-4 w-4" />
                    Offline-ready
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
                    <Camera className="h-4 w-4" />
                    Photo evidence
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800">
                    <Users className="h-4 w-4" />
                    Team coordination
                  </div>
                </div>
              </div>
            </section>

            {/* Access Cards */}
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {showAuthActions ? 'Ready to get started?' : 'Access your workspace'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {showAuthActions
                      ? 'Sign in to access your FuelFlo workspace.'
                      : `Continue to your ${profile?.role?.replace('_', ' ') || 'dashboard'} workspace.`}
                  </p>
                </div>
                {showAuthActions ? (
                  <AuthForm />
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      The home page stays visible for logged-in users too. Use the button below to go to your workspace.
                    </p>
                    <Link
                      href={dashboardRoute}
                      className="button-big w-full justify-center"
                    >
                      Go to dashboard
                    </Link>
                  </div>
                )}
              </div>

              {showAuthActions && (
                <InstallAppCard className="h-full shadow-lg" />
              )}
            </section>

            {/* Key Benefits */}
            <section>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {benefits.map((benefit, index) => (
                  <div key={benefit.title} className="group">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-xl bg-slate-100 p-2 group-hover:bg-orange-100 transition-colors">
                          <benefit.icon className="h-6 w-6 text-slate-600 group-hover:text-orange-600" />
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Benefit {index + 1}
                        </div>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Get started in 3 steps</h2>
                <p className="text-slate-600">Simple onboarding for your entire team</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {steps.map((step) => (
                  <div key={step.label} className="text-center">
                    <div className="relative mb-4">
                      <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                        <step.icon className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center">
                        {step.label}
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Social Proof */}
            <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white text-center">
              <div className="max-w-2xl mx-auto">
                <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Trusted by field operations teams</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  FuelFlo helps crews work faster, managers approve quicker, and operations stay compliant.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">50+</div>
                    <div className="text-sm text-slate-400">Active projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">1000+</div>
                    <div className="text-sm text-slate-400">Transactions logged</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">24/7</div>
                    <div className="text-sm text-slate-400">Offline support</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-8">
            {/* Contact Support */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Need access?</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Contact your hire desk or operations manager to get set up.
                </p>
                <button className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
          // Redirect logged-in users directly to their dashboard
          const dashboardRoute = ROLE_ROUTES[profileData.role] || '/resources/projects';
          router.push(dashboardRoute);
          return;
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
            // Redirect to dashboard when user logs in
            const dashboardRoute = ROLE_ROUTES[profileData.role] || '/resources/projects';
            router.push(dashboardRoute);
          }
        } else {
          setProfile(null);
          setLoading(false);
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

  // Only show landing page for non-logged-in users
  // Logged-in users are redirected to their dashboard
  return (
    <LandingPage
      showAuthActions={true}
      user={null}
      profile={null}
    />
  );
}
