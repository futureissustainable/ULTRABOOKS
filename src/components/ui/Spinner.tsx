'use client';

import { clsx } from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={clsx(
        'inline-block animate-spin',
        {
          'w-4 h-4': size === 'sm',
          'w-6 h-6': size === 'md',
          'w-10 h-10': size === 'lg',
        },
        className
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path
          d="M12 2v4M12 18v4M4 12H2M6 6L4 4M18 6l2-2M6 18l-2 2M18 18l2 2M22 12h-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
}
