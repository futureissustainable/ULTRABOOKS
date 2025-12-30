import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container-page py-20 md:py-32 lg:py-40 relative">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Your Books,
                <br />
                <span className="text-[var(--accent)]">Everywhere</span>
              </h1>
              <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-md leading-relaxed">
                Upload EPUB, PDF, or MOBI files. Sync your reading progress, bookmarks, and highlights across all your devices.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/signup">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[var(--bg-secondary)]">
          <div className="container-page section-spacing-lg">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to read better</h2>
              <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
                Built for readers who value simplicity, speed, and seamless synchronization.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card variant="elevated" padding="lg" hoverable>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9m-9 9a9 9 0 0 1 9-9"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3">Cross-Device Sync</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Reading progress, bookmarks, and highlights sync automatically across all devices in real-time.
                </p>
              </Card>

              <Card variant="elevated" padding="lg" hoverable>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3">Custom Reader</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Adjust fonts, sizes, margins, and themes. Your reading experience, tailored to you.
                </p>
              </Card>

              <Card variant="elevated" padding="lg" hoverable>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3">Highlights & Notes</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Highlight passages and add notes. All annotations saved and synced automatically.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[var(--accent)] to-blue-700">
          <div className="container-page section-spacing-lg">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Start Reading Today</h2>
              <p className="text-lg text-white/80 mb-10 max-w-md mx-auto leading-relaxed">
                Create a free account and upload your first book in seconds.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-[var(--accent)] hover:bg-gray-100">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
