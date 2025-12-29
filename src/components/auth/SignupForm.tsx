'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Button, Input, Card } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';

export function SignupForm() {
  const router = useRouter();
  const { signUp, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = await signUp(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <Card variant="elevated" padding="xl" className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-[var(--success)] flex items-center justify-center">
            <PixelIcon name="check" size={26} className="text-black" />
          </div>
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-1">
              Almost done
            </p>
            <h1 className="font-heading text-2xl">Check Email</h1>
          </div>
        </div>

        <p className="font-body text-[13px] text-[var(--text-secondary)] mb-8 leading-relaxed">
          We&apos;ve sent you a confirmation email. Please check your inbox and click the
          link to verify your account.
        </p>

        <Link href="/login">
          <Button fullWidth>Go to Login</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="xl" className="w-full max-w-md">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-[var(--bg-inverse)] flex items-center justify-center">
          <PixelIcon name="plus" size={26} className="text-[var(--text-inverse)]" />
        </div>
        <div>
          <p className="font-body text-[11px] uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-1">
            Get started
          </p>
          <h1 className="font-heading text-2xl">Sign Up</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          fullWidth
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
          fullWidth
        />

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          required
          fullWidth
        />

        {error && (
          <div className="p-4 border-2 border-[var(--accent)] bg-[var(--accent)]/5">
            <p className="font-body text-[13px] text-[var(--accent)]">{error}</p>
          </div>
        )}

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t-2 border-[var(--border-subtle)]">
        <p className="font-body text-[13px] text-center text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}
