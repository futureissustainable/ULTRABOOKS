'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/lib/stores/auth-store';
import { PixelIcon } from '@/components/icons/PixelIcon';

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-[var(--border-primary)] bg-dot-grid">
          <div className="container-page py-20 md:py-32 lg:py-40">
            <div className="max-w-3xl">
              <p className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.1em] text-[var(--text-secondary)] mb-6">
                Digital Book Reader
              </p>
              <h1 className="font-[family-name:var(--font-display)] fs-h-lg md:fs-h-xl lg:fs-h-xl uppercase tracking-tight mb-8 leading-[0.9]">
                Your Books,
                <br />
                Everywhere
              </h1>
              <p className="font-[family-name:var(--font-ui)] fs-p-lg text-[var(--text-secondary)] mb-12 max-w-md leading-relaxed">
                Upload EPUB, PDF, or MOBI files. Sync your reading progress, bookmarks, and highlights across all your devices.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href={user ? '/library' : '/signup'}>
                  <Button size="lg">{user ? 'Go to Library' : 'Get Started'}</Button>
                </Link>
                {!user && (
                  <Link href="/login">
                    <Button variant="secondary" size="lg">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
          <div className="container-page section-spacing-lg">
            <div className="mb-16">
              <p className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.1em] text-[var(--text-secondary)] mb-4">
                Features
              </p>
              <h2 className="font-[family-name:var(--font-display)] fs-h-lg md:fs-h-lg uppercase">
                Everything You Need
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-[1px] bg-[var(--border-primary)] border border-[var(--border-primary)]">
              <div className="bg-[var(--bg-primary)] p-8">
                <div className="w-12 h-12 border border-[var(--border-primary)] flex items-center justify-center mb-6">
                  <PixelIcon name="globe" size={20} className="text-[var(--text-secondary)]" />
                </div>
                <h3 className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] mb-3">Cross-Device Sync</h3>
                <p className="font-[family-name:var(--font-ui)] fs-p-lg text-[var(--text-secondary)] leading-relaxed">
                  Reading progress, bookmarks, and highlights sync automatically across all devices in real-time.
                </p>
              </div>

              <div className="bg-[var(--bg-primary)] p-8">
                <div className="w-12 h-12 border border-[var(--border-primary)] flex items-center justify-center mb-6">
                  <PixelIcon name="layout" size={20} className="text-[var(--text-secondary)]" />
                </div>
                <h3 className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] mb-3">Custom Reader</h3>
                <p className="font-[family-name:var(--font-ui)] fs-p-lg text-[var(--text-secondary)] leading-relaxed">
                  Adjust fonts, sizes, margins, and themes. Your reading experience, tailored to you.
                </p>
              </div>

              <div className="bg-[var(--bg-primary)] p-8">
                <div className="w-12 h-12 border border-[var(--border-primary)] flex items-center justify-center mb-6">
                  <PixelIcon name="edit" size={20} className="text-[var(--text-secondary)]" />
                </div>
                <h3 className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] mb-3">Highlights & Notes</h3>
                <p className="font-[family-name:var(--font-ui)] fs-p-lg text-[var(--text-secondary)] leading-relaxed">
                  Highlight passages and add notes. All annotations saved and synced automatically.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
