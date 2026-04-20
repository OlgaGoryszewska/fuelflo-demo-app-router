export const dynamic = 'force-dynamic';
import AuthForm from '@/components/AuthForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="background-container w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
