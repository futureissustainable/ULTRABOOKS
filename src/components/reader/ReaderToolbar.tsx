'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import { useReaderStore } from '@/lib/stores/reader-store';
import { PixelIcon } from '@/components/icons/PixelIcon';

interface ReaderToolbarProps {
  title: string;
  progress: number;
  onBookmark: () => void;
  isBookmarked: boolean;
}

export function ReaderToolbar({
  title,
  progress,
  onBookmark,
  isBookmarked,
}: ReaderToolbarProps) {
  const {
    setSettingsOpen,
    setHighlightsOpen,
  } = useReaderStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
      <div className="flex items-center justify-between px-3 h-11">
        {/* Left - Back */}
        <Link
          href="/library"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Back to library"
        >
          <PixelIcon name="chevron-left" size={14} />
          <span className="font-ui fs-p-sm uppercase tracking-wide hidden sm:inline">
            Back
          </span>
        </Link>

        {/* Center - Title (minimal) */}
        <span className="font-ui fs-p-sm text-[var(--text-tertiary)] truncate max-w-[200px] hidden sm:block">
          {title}
        </span>

        {/* Right - Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={onBookmark}
            className={clsx(
              'p-2 transition-colors rounded-sm',
              isBookmarked
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            )}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <PixelIcon name={isBookmarked ? 'bookmark-filled' : 'bookmark'} size={16} />
          </button>
          <button
            onClick={() => setHighlightsOpen(true)}
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors rounded-sm"
            aria-label="View highlights"
          >
            <PixelIcon name="highlight" size={16} />
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors rounded-sm"
            aria-label="Settings"
          >
            <PixelIcon name="settings" size={16} />
          </button>
        </div>
      </div>

      {/* Progress Bar - subtle */}
      <div className="h-[1px] bg-[var(--bg-tertiary)]">
        <div
          className="h-full bg-[var(--text-tertiary)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
