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
    <Card variant="elevated" padding="xl" className="w-full max-w-md">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-[var(--bg-inverse)] flex items-center justify-center">
          <PixelIcon name="user" size={26} className="text-[var(--text-inverse)]" />
        </div>
        <div>
          <p className="font-body text-[11px] uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-1">
            Welcome back
          </p>
          <h1 className="font-heading text-2xl">Login</h1>
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
          placeholder="Enter your password"
          required
          fullWidth
        />

        {error && (
          <div className="p-4 border-2 border-[var(--accent)] bg-[var(--accent)]/5">
            <p className="font-body text-[13px] text-[var(--accent)]">{error}</p>
          </div>
        )}

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t-2 border-[var(--border-subtle)]">
        <p className="font-body text-[13px] text-center text-[var(--text-secondary)]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  );
}
