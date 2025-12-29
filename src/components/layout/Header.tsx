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
      <div className="container-page h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={user ? '/library' : '/'}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-[var(--bg-inverse)] flex items-center justify-center transition-colors group-hover:bg-[var(--accent)]">
            <PixelIcon name="book" size={22} className="text-[var(--text-inverse)]" />
          </div>
          <span className="font-heading text-xl tracking-tight">
            Ultrabooks
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                href="/library"
                className="font-body text-[12px] uppercase tracking-[0.1em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Library
              </Link>
              <Link
                href="/settings"
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <PixelIcon name="settings" size={20} />
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                <PixelIcon name="logout" size={20} />
              </button>
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
