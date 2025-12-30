'use client';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)]">
      <div className="container-page py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Ultrabooks
            </span>
            <span className="text-[var(--text-tertiary)]">·</span>
            <span className="text-sm text-[var(--text-secondary)]">
              Read Anywhere
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 bg-[var(--bg-secondary)] rounded-md text-[var(--text-secondary)]">
              EPUB
            </span>
            <span className="text-xs px-2 py-1 bg-[var(--bg-secondary)] rounded-md text-[var(--text-secondary)]">
              PDF
            </span>
            <span className="text-xs px-2 py-1 bg-[var(--bg-secondary)] rounded-md text-[var(--text-secondary)]">
              MOBI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
