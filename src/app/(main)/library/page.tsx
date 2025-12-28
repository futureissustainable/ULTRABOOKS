import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LibraryGrid } from '@/components/library/LibraryGrid';

export default function LibraryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="font-display text-3xl uppercase mb-8">My Library</h1>
          <LibraryGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
