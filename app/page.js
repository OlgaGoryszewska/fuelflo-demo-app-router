export const dynamic = 'force-dynamic';
import AuthForm from '@/components/AuthForm';
import InstallAppCard from '@/components/InstallAppCard';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="background-container w-full max-w-md">
        <AuthForm />
      </div>
      <InstallAppCard />
      
    </div>
    
  );
}
