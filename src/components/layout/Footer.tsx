'use client';

export function Footer() {
  return (
    <footer className="border-t-2 border-[var(--border-primary)] bg-[var(--bg-primary)]">
      <div className="container-page py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-heading text-sm tracking-tight">
              Ultrabooks
            </span>
            <span className="text-[var(--border-subtle)]">|</span>
            <span className="font-body text-[11px] uppercase tracking-[0.1em] text-[var(--text-secondary)]">
              Read Anywhere
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
              EPUB
            </span>
            <span className="text-[var(--text-tertiary)]">/</span>
            <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
              PDF
            </span>
            <span className="text-[var(--text-tertiary)]">/</span>
            <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
              MOBI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
