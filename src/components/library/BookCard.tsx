'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Book } from '@/lib/supabase/types';
import { useBookStore } from '@/lib/stores/book-store';
import { Card, Button, Modal } from '@/components/ui';
import { ShareModal } from './ShareModal';

interface BookCardProps {
  book: Book;
}

const fileTypeColors: Record<string, string> = {
  epub: 'from-blue-500 to-blue-600',
  pdf: 'from-red-500 to-red-600',
  mobi: 'from-orange-500 to-orange-600',
};

export function BookCard({ book }: BookCardProps) {
  const { deleteBook, isLoading } = useBookStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
      <Card variant="default" padding="none" className="group relative overflow-hidden hover:shadow-[var(--shadow-lg)] transition-all duration-200">
        {/* Cover or Placeholder */}
        <Link href={`/reader/${book.id}`}>
          <div className="aspect-[3/4] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center relative overflow-hidden">
            {book.cover_url ? (
              <Image
                src={book.cover_url}
                alt={book.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 p-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${fileTypeColors[book.file_type] || 'from-gray-500 to-gray-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  {book.file_type}
                </span>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-sm">
              <span className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium shadow-lg">
                Open Book
              </span>
            </div>
          </div>
        </Link>

        {/* Book Info */}
        <div className="p-4">
          <h3 className="text-sm font-semibold truncate mb-1" title={book.title}>
            {book.title}
          </h3>
          {book.author && (
            <p className="text-xs text-[var(--text-secondary)] truncate mb-3">
              {book.author}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-tertiary)]">
              {formatFileSize(book.file_size)}
            </span>
            <div className="flex items-center gap-1 -mr-1">
              <button
                onClick={() => setShowShareModal(true)}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--accent)] hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                aria-label="Share book"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--error)] hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                aria-label="Delete book"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
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
        <div className="space-y-6">
          <p className="text-[var(--text-secondary)] leading-relaxed">
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

      {/* Share Modal */}
      <ShareModal
        book={book}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
}
