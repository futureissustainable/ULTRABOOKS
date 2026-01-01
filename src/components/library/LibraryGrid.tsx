'use client';

import { useEffect, useState, useCallback } from 'react';
import { useBookStore } from '@/lib/stores/book-store';
import { BookCard } from './BookCard';
import { BookUpload } from './BookUpload';
import { BookRow } from './BookRow';
import { Button, Spinner } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';
import { classicBooks } from '@/lib/classics-data';
import { clsx } from 'clsx';

export function LibraryGrid() {
  const { books, fetchBooks, isLoading, hasFetched, error, uploadBook, uploadBooks, isUploading, uploadProgress, fetchQuota } = useBookStore();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'netflix' | 'grid'>('netflix');

  useEffect(() => {
    if (!hasFetched) {
      fetchBooks();
      fetchQuota();
    }
  }, [fetchBooks, fetchQuota, hasFetched]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort books by created_at descending (newest first)
  const sortedBooks = [...filteredBooks].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const validateFile = (file: File): boolean => {
    const acceptedTypes = ['.epub', '.pdf', '.mobi'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      setDragError(`Invalid file type. Accepted: ${acceptedTypes.join(', ')}`);
      return false;
    }
    if (file.size > 100 * 1024 * 1024) {
      setDragError('File too large. Maximum size is 100MB.');
      return false;
    }
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragError(null);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragError(null);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => validateFile(file));

    if (validFiles.length === 0) return;

    if (validFiles.length === 1) {
      const result = await uploadBook(validFiles[0]);
      if (result.error) {
        setDragError(result.error);
        setTimeout(() => setDragError(null), 5000);
      }
    } else {
      const result = await uploadBooks(validFiles);
      if (result.failed.length > 0) {
        setDragError(`${result.successful.length} uploaded, ${result.failed.length} failed`);
        setTimeout(() => setDragError(null), 5000);
      }
    }
  }, [uploadBook, uploadBooks]);

  if (isLoading && !hasFetched) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-6">
          <Spinner size="lg" />
          <p className="font-ui fs-p-sm uppercase tracking-[0.05em] text-[var(--text-secondary)]">
            Loading library...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx('library-drop-zone', isDragging && 'dragging')}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Upload Progress */}
      {isUploading && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] min-w-[200px]">
          <div className="flex items-center gap-3 mb-2">
            <Spinner size="sm" />
            <span className="font-ui fs-p-sm uppercase tracking-[0.02em]">
              {uploadProgress
                ? `Uploading ${uploadProgress.current}/${uploadProgress.total}`
                : 'Uploading...'}
            </span>
          </div>
          {uploadProgress && (
            <>
              <div className="h-1 bg-[var(--bg-tertiary)] mb-1">
                <div
                  className="h-full bg-[var(--text-primary)] transition-all duration-300"
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                />
              </div>
              <p className="font-mono fs-p-sm text-[var(--text-tertiary)] truncate">
                {uploadProgress.currentFile}
              </p>
            </>
          )}
        </div>
      )}

      {/* Error Toast */}
      {dragError && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--text-primary)]">
          <p className="font-ui fs-p-sm uppercase tracking-[0.02em] text-[var(--text-primary)]">
            {dragError}
          </p>
        </div>
      )}

      {/* Toolbar - Simplified */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 relative">
          <PixelIcon
            name="search"
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 font-ui fs-p-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--text-tertiary)] transition-all duration-100 border border-[var(--border-primary)]"
          />
        </div>
        <div className="flex">
          <button
            onClick={() => setViewMode('netflix')}
            className={clsx(
              'p-2.5 transition-all duration-100 border border-[var(--border-primary)]',
              viewMode === 'netflix'
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
            )}
            aria-label="Row view"
          >
            <PixelIcon name="menu" size={14} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={clsx(
              'p-2.5 transition-all duration-100 border border-l-0 border-[var(--border-primary)]',
              viewMode === 'grid'
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
            )}
            aria-label="Grid view"
          >
            <PixelIcon name="layout" size={14} />
          </button>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="p-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all duration-100 border border-[var(--border-primary)]"
          aria-label="Upload book"
        >
          <PixelIcon name="upload" size={14} />
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 border border-[var(--border-primary)] bg-[var(--bg-secondary)] mb-6">
          <p className="font-ui fs-p-sm uppercase tracking-[0.02em] text-[var(--text-primary)]">{error}</p>
        </div>
      )}

      {/* Content */}
      {books.length === 0 ? (
        <>
          <div className="text-center py-16 md:py-24 border border-[var(--border-primary)] bg-[var(--bg-secondary)] mb-8">
            <div className="w-16 h-16 mx-auto mb-6 border border-[var(--border-primary)] flex items-center justify-center">
              <PixelIcon name="library" size={32} className="text-[var(--text-tertiary)]" />
            </div>
            <h2 className="font-display fs-h-lg uppercase mb-3">No Books Yet</h2>
            <p className="font-ui fs-p-sm uppercase tracking-[0.05em] text-[var(--text-secondary)] mb-8 max-w-sm mx-auto px-4">
              Upload your first EPUB, PDF, or MOBI file. Or browse our collection of free classics below.
            </p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <PixelIcon name="upload" size={12} className="mr-2" />
              Upload First Book
            </Button>
          </div>

          <BookRow
            title="Popular Classics"
            subtitle="Free public domain books"
            classicBooks={classicBooks}
          />
        </>
      ) : searchQuery ? (
        <>
          <div className="mb-4">
            <p className="font-ui fs-p-sm text-[var(--text-secondary)]">
              {filteredBooks.length} {filteredBooks.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </p>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-16 md:py-24 border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
              <div className="w-16 h-16 mx-auto mb-6 border border-[var(--border-primary)] flex items-center justify-center">
                <PixelIcon name="search" size={32} className="text-[var(--text-tertiary)]" />
              </div>
              <h2 className="font-display fs-h-sm uppercase mb-3">No Results</h2>
              <p className="font-ui fs-p-sm text-[var(--text-secondary)]">
                No books match your search
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sortedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </>
      ) : viewMode === 'netflix' ? (
        <div className="space-y-10">
          <BookRow
            title="Latest Books"
            books={sortedBooks}
            onViewAll={() => setViewMode('grid')}
          />

          <BookRow
            title="Popular Classics"
            subtitle="Free public domain books"
            classicBooks={classicBooks}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-ui fs-p-sm text-[var(--text-secondary)]">
              All Books ({books.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}

      <BookUpload isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}
