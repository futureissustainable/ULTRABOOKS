'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useBookStore } from '@/lib/stores/book-store';
import { BookReader } from '@/components/reader/BookReader';
import { Spinner } from '@/components/ui';

interface ReaderPageProps {
  params: Promise<{ id: string }>;
}

export default function ReaderPage({ params }: ReaderPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { currentBook, fetchBook, isLoading, error } = useBookStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (id && !initialized) {
      fetchBook(id);
      setInitialized(true);
    }
  }, [id, fetchBook, initialized]);

  useEffect(() => {
    if (error && !isLoading) {
      router.push('/library');
    }
  }, [error, isLoading, router]);

  if (isLoading || !currentBook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="font-ui text-sm uppercase tracking-wide animate-pulse-brutal">
            Loading book...
          </p>
        </div>
      </div>
    );
  }

  return <BookReader book={currentBook} />;
}
