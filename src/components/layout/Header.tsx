'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useThemeStore } from '@/lib/stores/theme-store';
import { Button } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';
import { clsx } from 'clsx';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <>
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {user && (
              <>
                <Link
                  href="/library"
                  className={clsx(
                    'px-4 py-2 font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] transition-colors',
                    pathname === '/library'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]'
                  )}
                >
                  Library
                </Link>
                <Link
                  href="/clubs"
                  className={clsx(
                    'px-4 py-2 font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] transition-colors',
                    pathname === '/clubs'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]'
                  )}
                >
                  Clubs
                </Link>
                <Link
                  href="/settings"
                  className={clsx(
                    'px-4 py-2 font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] transition-colors',
                    pathname === '/settings'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]'
                  )}
                >
                  Settings
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors"
            aria-label="Open menu"
          >
            <PixelIcon name="menu" size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={clsx('mobile-menu-overlay', mobileMenuOpen && 'open')}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div className={clsx('mobile-menu', mobileMenuOpen && 'open')}>
        <div className="mobile-menu-header">
          <span className="font-[family-name:var(--font-display)] fs-h-sm tracking-tight uppercase">
            Menu
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors border border-[var(--border-primary)]"
            aria-label="Close menu"
          >
            <PixelIcon name="close" size={16} />
          </button>
        </div>

        <nav className="mobile-menu-nav">
          {user ? (
            <>
              <Link href="/library" className="mobile-menu-item">
                <span className="flex items-center gap-3">
                  <PixelIcon name="library" size={16} />
                  Library
                </span>
              </Link>
              <Link href="/clubs" className="mobile-menu-item">
                <span className="flex items-center gap-3">
                  <PixelIcon name="users" size={16} />
                  Book Clubs
                </span>
              </Link>
              <Link href="/settings" className="mobile-menu-item">
                <span className="flex items-center gap-3">
                  <PixelIcon name="settings" size={16} />
                  Settings
                </span>
              </Link>
              <button
                onClick={toggleTheme}
                className="mobile-menu-item text-left w-full"
              >
                <span className="flex items-center gap-3">
                  <PixelIcon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
              <button
                onClick={handleSignOut}
                className="mobile-menu-item text-left w-full"
              >
                <span className="flex items-center gap-3">
                  <PixelIcon name="log-out" size={16} />
                  Sign Out
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                className="mobile-menu-item text-left w-full"
              >
                <span className="flex items-center gap-3">
                  <PixelIcon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
              <Link href="/login" className="mobile-menu-item">
                <span className="flex items-center gap-3">
                  <PixelIcon name="log-in" size={16} />
                  Login
                </span>
              </Link>
              <Link href="/signup" className="mobile-menu-item">
                <span className="flex items-center gap-3">
                  <PixelIcon name="user-plus" size={16} />
                  Sign Up
                </span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
