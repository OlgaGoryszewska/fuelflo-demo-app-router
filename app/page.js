export const dynamic = 'force-dynamic';
import AuthForm from '@/components/AuthForm';
import InstallAppCard from '@/components/InstallAppCard';

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[640px] flex-col justify-center px-3 py-6">
      <AuthForm />
      <InstallAppCard />
    </div>
  );
}
