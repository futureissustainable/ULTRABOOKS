'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Button, Input, Card } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';

export function LoginForm() {
  const router = useRouter();
  const { signIn, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/library');
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="w-full max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[var(--bg-inverse)] flex items-center justify-center">
          <PixelIcon name="user" size={24} className="text-[var(--text-inverse)]" />
        </div>
        <h1 className="font-display text-2xl">Login</h1>
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
          placeholder="Enter your password"
          required
          fullWidth
        />

        {error && (
          <div className="p-3 border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10">
            <p className="font-ui text-sm text-[var(--color-accent)]">{error}</p>
          </div>
        )}

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t-2 border-[var(--border-secondary)]">
        <p className="font-ui text-sm text-center text-[var(--text-secondary)]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--text-primary)]">
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  );
}
