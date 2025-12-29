'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import type { Book } from '@/lib/supabase/types';
import { useReaderStore } from '@/lib/stores/reader-store';
import { ReaderToolbar } from './ReaderToolbar';
import { ReaderSettings } from './ReaderSettings';
import { TableOfContents } from './TableOfContents';
import { BookmarksList } from './BookmarksList';
import { HighlightsList } from './HighlightsList';
import { PixelIcon } from '@/components/icons/PixelIcon';

interface EpubReaderProps {
  book: Book;
}

interface TocItem {
  id: string;
  href: string;
  label: string;
  subitems?: TocItem[];
}

export function EpubReader({ book }: EpubReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<unknown>(null);
  const bookRef = useRef<unknown>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [currentHref, setCurrentHref] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Width control state (percentage of viewport)
  const [contentWidth, setContentWidth] = useState(65);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSide, setDragSide] = useState<'left' | 'right' | null>(null);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const {
    settings,
    loadProgress,
    updateProgress,
    bookmarks,
    loadBookmarks,
    addBookmark,
    removeBookmark,
    loadHighlights,
    addHighlight,
  } = useReaderStore();

  const isCurrentLocationBookmarked = bookmarks.some(
    (b) => b.location === currentHref
  );

  // Handle drag to resize - using pointer events for better tracking
  const handleMouseDown = useCallback((e: React.MouseEvent, side: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragSide(side);
    dragStartX.current = e.clientX;
    dragStartWidth.current = contentWidth;
  }, [contentWidth]);

  // Global mouse move/up handlers for dragging
  useEffect(() => {
    if (!isDragging || !dragSide) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - dragStartX.current;
      const deltaPercent = (deltaX / window.innerWidth) * 100;

      let newWidth: number;
      if (dragSide === 'right') {
        newWidth = dragStartWidth.current + deltaPercent * 2;
      } else {
        newWidth = dragStartWidth.current - deltaPercent * 2;
      }

      // Clamp between 30% and 95%
      const clampedWidth = Math.min(Math.max(30, newWidth), 95);
      setContentWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragSide(null);
    };

    // Use capture phase for better event handling
    document.addEventListener('mousemove', handleMouseMove, { capture: true });
    document.addEventListener('mouseup', handleMouseUp, { capture: true });
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove, { capture: true });
      document.removeEventListener('mouseup', handleMouseUp, { capture: true });
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragSide]);

  // Resize rendition when content width changes
  useEffect(() => {
    if (renditionRef.current && !isLoading) {
      const rendition = renditionRef.current as { resize: (width?: number, height?: number) => void };
      // Immediate resize, no delay needed
      rendition.resize();
    }
  }, [contentWidth, isLoading]);

  // Initialize EPUB reader
  useEffect(() => {
    let mounted = true;

    const initReader = async () => {
      try {
        const ePub = (await import('epubjs')).default;

        if (!mounted || !containerRef.current) return;

        const epubBook = ePub(book.file_url);
        bookRef.current = epubBook;

        await epubBook.ready;

        if (!mounted) return;

        // Get table of contents
        const navigation = await epubBook.loaded.navigation;
        if (navigation?.toc) {
          const formatToc = (items: unknown[]): TocItem[] => {
            return (items as Array<{id?: string; href?: string; label?: string; subitems?: unknown[]}>).map((item) => ({
              id: item.id || '',
              href: item.href || '',
              label: item.label || '',
              subitems: item.subitems ? formatToc(item.subitems) : undefined,
            }));
          };
          setToc(formatToc(navigation.toc));
        }

        // Create rendition with continuous scroll (scrolled-doc is the correct flow for endless scroll)
        const rendition = epubBook.renderTo(containerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'none',
          flow: 'scrolled-doc',
          manager: 'continuous',
        });
        renditionRef.current = rendition;

        // Apply initial theme/styles
        applyStyles(rendition);

        // Load saved progress or display first page
        const savedProgress = await loadProgress(book.id);
        if (savedProgress?.current_location) {
          await rendition.display(savedProgress.current_location);
        } else {
          await rendition.display();
        }

        // Load bookmarks and highlights
        await Promise.all([
          loadBookmarks(book.id),
          loadHighlights(book.id),
        ]);

        // Handle location changes
        rendition.on('relocated', (location: {start: {cfi: string; href: string; percentage: number; displayed: {page: number; total: number}}}) => {
          if (!mounted) return;

          const { cfi, href, percentage, displayed } = location.start;
          setCurrentHref(href);
          setProgress(percentage * 100);
          setCurrentPage(displayed.page);
          setTotalPages(displayed.total);

          updateProgress(book.id, cfi, displayed.page, percentage * 100);
        });

        // Handle text selection for highlighting
        rendition.on('selected', (cfiRange: string, contents: unknown) => {
          const selection = (contents as {window: Window}).window.getSelection();
          if (selection && selection.toString().trim()) {
            const text = selection.toString().trim();
            if (text.length > 0) {
              addHighlight(book.id, cfiRange, text, 'yellow');
              selection.removeAllRanges();
            }
          }
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading EPUB:', err);
        if (mounted) {
          setError('Failed to load book. Please try again.');
          setIsLoading(false);
        }
      }
    };

    initReader();

    return () => {
      mounted = false;
      if (bookRef.current) {
        (bookRef.current as {destroy: () => void}).destroy();
      }
    };
  }, [book.file_url, book.id]);

  // Apply reader settings
  const applyStyles = useCallback((rendition: unknown) => {
    if (!rendition) return;

    const themes: Record<string, { body: Record<string, string> }> = {
      light: {
        body: {
          background: '#ffffff',
          color: '#000000',
        },
      },
      dark: {
        body: {
          background: '#000000',
          color: '#ffffff',
        },
      },
      sepia: {
        body: {
          background: '#f4ecd8',
          color: '#5b4636',
        },
      },
    };

    const theme = themes[settings.theme] || themes.light;

    (rendition as {themes: {default: (style: Record<string, unknown>) => void}}).themes.default({
      body: {
        ...theme.body,
        'font-family': `${settings.fontFamily}, serif !important`,
        'font-size': `${settings.fontSize}px !important`,
        'line-height': `${settings.lineHeight} !important`,
        'text-align': `${settings.textAlign} !important`,
        padding: `${settings.margins}px !important`,
      },
      p: {
        'font-family': 'inherit !important',
        'font-size': 'inherit !important',
        'line-height': 'inherit !important',
      },
      img: {
        'max-width': '100% !important',
        'height': 'auto !important',
        'object-fit': 'contain !important',
      },
      svg: {
        'max-width': '100% !important',
        'height': 'auto !important',
      },
    });
  }, [settings]);

  // Update styles when settings change
  useEffect(() => {
    if (renditionRef.current) {
      applyStyles(renditionRef.current);
    }
  }, [settings, applyStyles]);

  // Navigation handlers
  const handleNavigate = useCallback((href: string) => {
    if (renditionRef.current) {
      (renditionRef.current as {display: (href: string) => void}).display(href);
    }
  }, []);

  const handleBookmarkToggle = useCallback(() => {
    const existing = bookmarks.find((b) => b.location === currentHref);
    if (existing) {
      removeBookmark(existing.id);
    } else {
      addBookmark(book.id, currentHref, currentPage, `Page ${currentPage}`);
    }
  }, [bookmarks, currentHref, currentPage, book.id, addBookmark, removeBookmark]);

  // Get theme background color for container
  const getThemeBackground = () => {
    switch (settings.theme) {
      case 'dark':
        return '#000000';
      case 'sepia':
        return '#f4ecd8';
      default:
        return '#ffffff';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center p-8">
          <PixelIcon name="close" size={48} className="mx-auto mb-4 text-[var(--color-accent)]" />
          <h2 className="font-display text-xl mb-2">Error Loading Book</h2>
          <p className="font-ui text-sm text-[var(--text-secondary)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: getThemeBackground() }}>
      <ReaderToolbar
        title={book.title}
        currentPage={currentPage}
        totalPages={totalPages}
        progress={progress}
        onBookmark={handleBookmarkToggle}
        isBookmarked={isCurrentLocationBookmarked}
      />

      {/* Left drag handle */}
      <div
        className={clsx(
          'fixed top-[60px] bottom-0 w-4 cursor-ew-resize z-40 group',
          isDragging && dragSide === 'left' && 'bg-[var(--color-accent)]/30'
        )}
        style={{ left: `calc(${(100 - contentWidth) / 2}% - 8px)` }}
        onMouseDown={(e) => handleMouseDown(e, 'left')}
      >
        {/* Visual indicator */}
        <div className={clsx(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-20 rounded-full transition-all',
          'bg-gray-400 group-hover:bg-[var(--color-accent)] group-hover:w-2 group-hover:h-24',
          isDragging && dragSide === 'left' && 'bg-[var(--color-accent)] w-2 h-24'
        )} />
      </div>

      {/* Right drag handle */}
      <div
        className={clsx(
          'fixed top-[60px] bottom-0 w-4 cursor-ew-resize z-40 group',
          isDragging && dragSide === 'right' && 'bg-[var(--color-accent)]/30'
        )}
        style={{ right: `calc(${(100 - contentWidth) / 2}% - 8px)` }}
        onMouseDown={(e) => handleMouseDown(e, 'right')}
      >
        {/* Visual indicator */}
        <div className={clsx(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-20 rounded-full transition-all',
          'bg-gray-400 group-hover:bg-[var(--color-accent)] group-hover:w-2 group-hover:h-24',
          isDragging && dragSide === 'right' && 'bg-[var(--color-accent)] w-2 h-24'
        )} />
      </div>

      {/* Reader Container - uses native scroll */}
      <div
        className="pt-[60px] min-h-screen"
        style={{ background: getThemeBackground() }}
      >
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-10" style={{ background: getThemeBackground() }}>
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin">
                <PixelIcon name="loading" size={32} />
              </div>
              <p className="font-ui text-sm uppercase tracking-wide animate-pulse-brutal">
                Loading book...
              </p>
            </div>
          </div>
        )}

        {/* Content wrapper with adjustable width */}
        <div
          className="mx-auto transition-[width] duration-75"
          style={{ width: `${contentWidth}%` }}
        >
          {/* EPUB content container */}
          <div
            ref={containerRef}
            className={clsx(
              'epub-container',
              isLoading && 'invisible'
            )}
          />
        </div>
      </div>

      {/* Width indicator during drag */}
      {isDragging && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-3 py-1 rounded font-mono text-sm">
          {Math.round(contentWidth)}%
        </div>
      )}

      {/* Modals */}
      <TableOfContents
        items={toc}
        currentHref={currentHref}
        onNavigate={handleNavigate}
      />
      <ReaderSettings />
      <BookmarksList onNavigate={handleNavigate} />
      <HighlightsList onNavigate={handleNavigate} />
    </div>
  );
}
