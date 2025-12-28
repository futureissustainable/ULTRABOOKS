import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PixelIcon } from '@/components/icons/PixelIcon';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b-2 border-[var(--border-primary)] bg-grid">
          <div className="max-w-7xl mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl">
              <h1 className="font-display text-5xl md:text-7xl uppercase leading-none mb-6">
                Read
                <br />
                Anywhere
              </h1>
              <p className="font-ui text-lg md:text-xl text-[var(--text-secondary)] mb-8 max-w-xl">
                A brutalist ebook reader. Upload EPUB, PDF, or MOBI files.
                Sync progress, bookmarks, and highlights across all your devices.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
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
        <section className="border-b-2 border-[var(--border-primary)]">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <h2 className="font-display text-3xl md:text-4xl uppercase mb-12">
              Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card variant="elevated" padding="lg" className="hover-lift">
                <div className="w-12 h-12 bg-[var(--bg-inverse)] flex items-center justify-center mb-4">
                  <PixelIcon name="sync" size={28} className="text-[var(--text-inverse)]" />
                </div>
                <h3 className="font-display text-xl mb-2">Cross-Device Sync</h3>
                <p className="font-ui text-sm text-[var(--text-secondary)]">
                  Your reading progress, bookmarks, and highlights sync automatically
                  across all your devices in real-time.
                </p>
              </Card>

              <Card variant="elevated" padding="lg" className="hover-lift">
                <div className="w-12 h-12 bg-[var(--bg-inverse)] flex items-center justify-center mb-4">
                  <PixelIcon name="layout" size={28} className="text-[var(--text-inverse)]" />
                </div>
                <h3 className="font-display text-xl mb-2">Customizable Reader</h3>
                <p className="font-ui text-sm text-[var(--text-secondary)]">
                  Adjust fonts, sizes, margins, and themes. Make your reading
                  experience exactly how you want it.
                </p>
              </Card>

              <Card variant="elevated" padding="lg" className="hover-lift">
                <div className="w-12 h-12 bg-[var(--bg-inverse)] flex items-center justify-center mb-4">
                  <PixelIcon name="highlight" size={28} className="text-[var(--text-inverse)]" />
                </div>
                <h3 className="font-display text-xl mb-2">Highlights & Notes</h3>
                <p className="font-ui text-sm text-[var(--text-secondary)]">
                  Highlight passages and add notes. All annotations are saved
                  and synced automatically.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Formats Section */}
        <section className="border-b-2 border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <h2 className="font-display text-3xl md:text-4xl uppercase mb-12">
              Supported Formats
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 border-2 border-[var(--border-primary)] bg-[var(--bg-primary)]">
                <PixelIcon name="file-epub" size={32} />
                <div>
                  <h3 className="font-display text-lg">EPUB</h3>
                  <p className="font-mono text-xs text-[var(--text-secondary)]">
                    .epub files
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border-2 border-[var(--border-primary)] bg-[var(--bg-primary)]">
                <PixelIcon name="file-pdf" size={32} />
                <div>
                  <h3 className="font-display text-lg">PDF</h3>
                  <p className="font-mono text-xs text-[var(--text-secondary)]">
                    .pdf files
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border-2 border-[var(--border-primary)] bg-[var(--bg-primary)]">
                <PixelIcon name="file-mobi" size={32} />
                <div>
                  <h3 className="font-display text-lg">MOBI</h3>
                  <p className="font-mono text-xs text-[var(--text-secondary)]">
                    .mobi files
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
            <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">
              Start Reading Now
            </h2>
            <p className="font-ui text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
              Create a free account and upload your first book in seconds.
            </p>
            <Link href="/signup">
              <Button size="lg">Create Free Account</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
