'use client';

import { useState } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import type { Book } from '@/lib/supabase/types';
import { useBookStore } from '@/lib/stores/book-store';
import { Card, Button, Modal } from '@/components/ui';
import { PixelIcon, IconName } from '@/components/icons/PixelIcon';

interface BookCardProps {
  book: Book;
}

const fileTypeIcons: Record<string, IconName> = {
  epub: 'file-epub',
  pdf: 'file-pdf',
  mobi: 'file-mobi',
};

export function BookCard({ book }: BookCardProps) {
  const { deleteBook, isLoading } = useBookStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    await deleteBook(book.id);
    setShowDeleteConfirm(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <Card variant="elevated" padding="none" className="group relative overflow-hidden">
        {/* Cover or Placeholder */}
        <Link href={`/reader/${book.id}`}>
          <div className="aspect-[3/4] bg-[var(--bg-tertiary)] flex items-center justify-center relative overflow-hidden">
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 p-4">
                <PixelIcon
                  name={fileTypeIcons[book.file_type] || 'book'}
                  size={48}
                  className="text-[var(--text-tertiary)]"
                />
                <span className="font-mono text-xs text-[var(--text-tertiary)] uppercase">
                  {book.file_type}
                </span>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="font-ui text-sm uppercase text-white">Read</span>
            </div>
          </div>
        </Link>

        {/* Book Info */}
        <div className="p-3 border-t-2 border-[var(--border-primary)]">
          <h3 className="font-ui text-sm font-bold truncate mb-1" title={book.title}>
            {book.title}
          </h3>
          {book.author && (
            <p className="font-ui text-xs text-[var(--text-secondary)] truncate mb-2">
              {book.author}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
              {formatFileSize(book.file_size)}
            </span>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 hover:text-[var(--color-accent)] transition-colors"
              aria-label="Delete book"
            >
              <PixelIcon name="trash" size={14} />
            </button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Book"
        size="sm"
      >
        <div className="space-y-4">
          <p className="font-ui text-sm">
            Are you sure you want to delete &ldquo;{book.title}&rdquo;? This will also remove all
            bookmarks, highlights, and reading progress.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
