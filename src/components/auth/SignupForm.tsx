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
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[var(--color-success)] flex items-center justify-center">
            <PixelIcon name="check" size={24} className="text-black" />
          </div>
          <h1 className="font-display text-2xl">Check Your Email</h1>
        </div>

        <p className="font-ui text-sm text-[var(--text-secondary)] mb-6">
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
    <Card variant="elevated" padding="lg" className="w-full max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[var(--bg-inverse)] flex items-center justify-center">
          <PixelIcon name="plus" size={24} className="text-[var(--text-inverse)]" />
        </div>
        <h1 className="font-display text-2xl">Sign Up</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="p-3 border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10">
            <p className="font-ui text-sm text-[var(--color-accent)]">{error}</p>
          </div>
        )}

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t-2 border-[var(--border-secondary)]">
        <p className="font-ui text-sm text-center text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--text-primary)]">
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}
