'use client';

export function Footer() {
  return (
    <footer className="border-t-2 border-[var(--border-primary)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-ui text-xs uppercase tracking-wide text-[var(--text-secondary)]">
            Ultrabooks - Read Anywhere
          </p>
          <p className="font-mono text-xs text-[var(--text-tertiary)]">
            EPUB / PDF / MOBI
          </p>
        </div>
      </div>
    </footer>
  );
}
