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
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-6">
          <Spinner size="lg" />
          <p className="font-body text-[12px] uppercase tracking-[0.15em] text-[var(--text-secondary)] animate-pulse-brutal">
            Loading library...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="flex-1 relative">
          <PixelIcon
            name="search"
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 font-body text-[13px] border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
          />
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>
          <PixelIcon name="upload" size={16} className="mr-2" />
          Upload Book
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-5 border-2 border-[var(--accent)] bg-[var(--accent)]/5 mb-8">
          <p className="font-body text-[13px] text-[var(--accent)]">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {books.length === 0 ? (
        <div className="text-center py-32 border-2 border-dashed border-[var(--border-subtle)]">
          <PixelIcon name="library" size={72} className="mx-auto mb-6 text-[var(--text-tertiary)]" />
          <h2 className="font-heading text-2xl mb-4">No Books Yet</h2>
          <p className="font-body text-[13px] text-[var(--text-secondary)] mb-8 max-w-sm mx-auto">
            Upload your first EPUB, PDF, or MOBI file to get started.
          </p>
          <Button onClick={() => setIsUploadOpen(true)}>
            <PixelIcon name="upload" size={16} className="mr-2" />
            Upload Your First Book
          </Button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-32 border-2 border-dashed border-[var(--border-subtle)]">
          <PixelIcon name="search" size={56} className="mx-auto mb-6 text-[var(--text-tertiary)]" />
          <h2 className="font-heading text-xl mb-3">No Results</h2>
          <p className="font-body text-[13px] text-[var(--text-secondary)]">
            No books match your search. Try a different query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
