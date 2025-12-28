'use client';

import { useEffect, useState } from 'react';
import { useBookStore } from '@/lib/stores/book-store';
import { BookCard } from './BookCard';
import { BookUpload } from './BookUpload';
import { Button, Spinner } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';

export function LibraryGrid() {
  const { books, fetchBooks, isLoading, error } = useBookStore();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && books.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="font-ui text-sm uppercase tracking-wide animate-pulse-brutal">
            Loading library...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <PixelIcon
            name="search"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 font-ui text-sm border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>
          <PixelIcon name="upload" size={16} className="mr-2" />
          Upload Book
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 mb-6">
          <p className="font-ui text-sm text-[var(--color-accent)]">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {books.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-[var(--border-secondary)]">
          <PixelIcon name="library" size={64} className="mx-auto mb-4 text-[var(--text-tertiary)]" />
          <h2 className="font-display text-2xl mb-2">No Books Yet</h2>
          <p className="font-ui text-sm text-[var(--text-secondary)] mb-6">
            Upload your first EPUB, PDF, or MOBI file to get started.
          </p>
          <Button onClick={() => setIsUploadOpen(true)}>
            <PixelIcon name="upload" size={16} className="mr-2" />
            Upload Your First Book
          </Button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-[var(--border-secondary)]">
          <PixelIcon name="search" size={48} className="mx-auto mb-4 text-[var(--text-tertiary)]" />
          <h2 className="font-display text-xl mb-2">No Results</h2>
          <p className="font-ui text-sm text-[var(--text-secondary)]">
            No books match your search. Try a different query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <BookUpload isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}
