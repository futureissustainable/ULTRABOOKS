'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';

export function Header() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="border-b-2 border-[var(--border-primary)] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={user ? '/library' : '/'} className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-[var(--bg-inverse)] flex items-center justify-center">
            <PixelIcon name="book" size={20} className="text-[var(--text-inverse)]" />
          </div>
          <span className="font-display text-xl uppercase tracking-tight">
            Ultrabooks
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/library"
                className="font-ui text-sm uppercase tracking-wide hover:text-[var(--color-accent)] no-underline"
              >
                Library
              </Link>
              <Link
                href="/settings"
                className="font-ui text-sm uppercase tracking-wide hover:text-[var(--color-accent)] no-underline"
              >
                <PixelIcon name="settings" size={20} />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <PixelIcon name="logout" size={16} />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
