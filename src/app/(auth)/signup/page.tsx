import { SignupForm } from '@/components/auth/SignupForm';
import { Header } from '@/components/layout/Header';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 bg-grid">
        <SignupForm />
      </main>
    </div>
  );
}
