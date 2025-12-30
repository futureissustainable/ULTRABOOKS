'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Placeholder book covers - will be replaced with actual covers from /public/hero-covers/
// These generate abstract book cover placeholders
const generatePlaceholderCovers = (count: number) => {
  const covers: string[] = [];
  for (let i = 0; i < count; i++) {
    covers.push(`/hero-covers/${String(i + 1).padStart(2, '0')}.jpg`);
  }
  return covers;
};

// Check if we have real covers or use placeholders
const PLACEHOLDER_COVERS = generatePlaceholderCovers(50);

interface BookCoverProps {
  index: number;
  useRealCovers: boolean;
}

function BookCover({ index, useRealCovers }: BookCoverProps) {
  const [hasError, setHasError] = useState(false);
  const coverPath = PLACEHOLDER_COVERS[index % PLACEHOLDER_COVERS.length];

  if (!useRealCovers || hasError) {
    // Render a stylized placeholder
    const patterns = ['stripes', 'dots', 'grid', 'solid', 'gradient'];
    const pattern = patterns[index % patterns.length];
    const opacity = 0.3 + (index % 4) * 0.15;

    return (
      <div
        className="hero-book-cover flex items-center justify-center"
        style={{
          background: pattern === 'stripes'
            ? `repeating-linear-gradient(45deg, var(--gray-800), var(--gray-800) 4px, var(--gray-900) 4px, var(--gray-900) 8px)`
            : pattern === 'dots'
            ? `radial-gradient(circle, var(--gray-700) 1px, var(--gray-900) 1px)`
            : pattern === 'grid'
            ? `linear-gradient(var(--gray-700) 1px, transparent 1px), linear-gradient(90deg, var(--gray-700) 1px, transparent 1px)`
            : pattern === 'gradient'
            ? `linear-gradient(135deg, var(--gray-800) 0%, var(--gray-950) 100%)`
            : 'var(--gray-900)',
          backgroundSize: pattern === 'dots' ? '8px 8px' : pattern === 'grid' ? '16px 16px' : 'auto',
          opacity,
        }}
      >
        <div className="w-8 h-8 border border-[var(--gray-600)] flex items-center justify-center opacity-50">
          <span className="text-[var(--gray-600)] text-xs font-mono">{index + 1}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-book-cover relative overflow-hidden">
      <Image
        src={coverPath}
        alt={`Book cover ${index + 1}`}
        fill
        className="object-cover"
        onError={() => setHasError(true)}
        sizes="(max-width: 768px) 100px, (max-width: 1024px) 120px, 140px"
      />
    </div>
  );
}

export function HeroBooks() {
  const [useRealCovers, setUseRealCovers] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if real covers exist by trying to load the first one
    const img = new window.Image();
    img.onload = () => setUseRealCovers(true);
    img.onerror = () => setUseRealCovers(false);
    img.src = '/hero-covers/01.jpg';
  }, []);

  if (!mounted) {
    return null;
  }

  // Create enough books to fill the rows (duplicated for seamless scrolling)
  const row1Books = Array.from({ length: 30 }, (_, i) => i);
  const row2Books = Array.from({ length: 30 }, (_, i) => i + 10);
  const row3Books = Array.from({ length: 30 }, (_, i) => i + 20);

  return (
    <div className="hero-books-container" aria-hidden="true">
      {/* Row 1 - Scrolling Left */}
      <div className="hero-books-row hero-books-row-1">
        {row1Books.map((i) => (
          <BookCover key={`r1-${i}`} index={i} useRealCovers={useRealCovers} />
        ))}
        {/* Duplicate for seamless loop */}
        {row1Books.map((i) => (
          <BookCover key={`r1-dup-${i}`} index={i} useRealCovers={useRealCovers} />
        ))}
      </div>

      {/* Row 2 - Scrolling Right */}
      <div className="hero-books-row hero-books-row-2">
        {row2Books.map((i) => (
          <BookCover key={`r2-${i}`} index={i} useRealCovers={useRealCovers} />
        ))}
        {/* Duplicate for seamless loop */}
        {row2Books.map((i) => (
          <BookCover key={`r2-dup-${i}`} index={i} useRealCovers={useRealCovers} />
        ))}
      </div>

      {/* Row 3 - Scrolling Left */}
      <div className="hero-books-row hero-books-row-3">
        {row3Books.map((i) => (
          <BookCover key={`r3-${i}`} index={i} useRealCovers={useRealCovers} />
        ))}
        {/* Duplicate for seamless loop */}
        {row3Books.map((i) => (
          <BookCover key={`r3-dup-${i}`} index={i} useRealCovers={useRealCovers} />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="hero-gradient-overlay" />
    </div>
  );
}
