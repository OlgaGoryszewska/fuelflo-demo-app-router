export const dynamic = 'force-dynamic';
import AuthForm from '../../components/AuthForm';

export default function SignInPage() {
  return (
    <div className="main-container">
      <div className="background-container">
        <AuthForm />
      </div>
    </div>
  );
}
