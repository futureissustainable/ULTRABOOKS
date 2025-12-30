'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useThemeStore } from '@/lib/stores/theme-store';
import { Button } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';

export function Header() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
      <div className="container-page flex items-center justify-between h-14">
        {/* Logo - always links to main page */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 bg-[var(--text-primary)] flex items-center justify-center">
            <PixelIcon name="book" size={16} className="text-[var(--bg-primary)]" />
          </div>
          <span className="font-[family-name:var(--font-display)] fs-h-sm tracking-tight uppercase">
            Ultrabooks
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {user && (
            <>
              <Link
                href="/library"
                className="px-4 py-2 font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors"
              >
                Library
              </Link>
              <Link
                href="/settings"
                className="px-4 py-2 font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors"
              >
                Settings
              </Link>
            </>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <PixelIcon name="sun" size={18} />
            ) : (
              <PixelIcon name="moon" size={18} />
            )}
          </button>

          {user ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors"
            >
              Sign Out
            </button>
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
        </div>
      </div>
    </header>
  );
}
