import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LibraryGrid } from '@/components/library/LibraryGrid';

export default function LibraryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header />

      <main className="flex-1">
        <div className="container-page py-12 md:py-16">
          <div className="mb-12">
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-3">
              Your Collection
            </p>
            <h1 className="font-heading">My Library</h1>
          </div>
          <LibraryGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
