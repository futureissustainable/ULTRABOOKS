'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Book } from '@/lib/supabase/types';
import { PixelIcon } from '@/components/icons/PixelIcon';

interface WhatsNextRowProps {
  books: Book[];
}

export function WhatsNextRow({ books }: WhatsNextRowProps) {
  if (books.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] text-[var(--text-secondary)]">
          What&apos;s Next
        </h2>
        <span className="font-[family-name:var(--font-mono)] fs-p-sm text-[var(--text-tertiary)]">
          Recently Added
        </span>
      </div>

      <div className="book-row border border-[var(--border-primary)] bg-[var(--border-primary)]">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/reader/${book.id}`}
            className="book-row-item group"
          >
            <div className="bg-[var(--bg-primary)] h-full flex flex-col border-r border-[var(--border-primary)] last:border-r-0 transition-all duration-[50ms] group-hover:bg-[var(--bg-secondary)]">
              {/* Cover */}
              <div className="aspect-[3/4] bg-[var(--bg-tertiary)] relative overflow-hidden border-b border-[var(--border-primary)]">
                {book.cover_url ? (
                  <Image
                    src={book.cover_url}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 bg-[var(--text-primary)] flex items-center justify-center">
                      <PixelIcon name="book" size={20} className="text-[var(--bg-primary)]" />
                    </div>
                    <span className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] text-[var(--text-tertiary)] border border-[var(--border-primary)] px-2 py-0.5">
                      {book.file_type}
                    </span>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[var(--bg-primary)]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-[50ms] flex items-center justify-center">
                  <span className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] px-3 py-1.5 bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--text-primary)]">
                    Read
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 flex-1 flex flex-col">
                <h3
                  className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.02em] truncate mb-1"
                  title={book.title}
                >
                  {book.title}
                </h3>
                {book.author && (
                  <p className="font-[family-name:var(--font-ui)] fs-p-sm text-[var(--text-secondary)] truncate">
                    {book.author}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
