'use client';

import type { Book } from '@/lib/supabase/types';
import { EpubReader } from './EpubReader';
import { PdfReader } from './PdfReader';

interface BookReaderProps {
  book: Book;
}

export function BookReader({ book }: BookReaderProps) {
  switch (book.file_type) {
    case 'epub':
    case 'mobi':
      // foliate-js handles both EPUB and MOBI natively
      return <EpubReader book={book} />;
    case 'pdf':
      return <PdfReader book={book} />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
          <p className="font-ui text-sm text-[var(--text-secondary)]">
            Unsupported file format: {book.file_type}
          </p>
        </div>
      );
  }
}
