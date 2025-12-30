'use client';

import { clsx } from 'clsx';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hoverable, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bg-[var(--bg-primary)]',
          'rounded-xl',
          'transition-all duration-200',
          // Variant styles
          {
            'border border-[var(--border-primary)]': variant === 'default',
            'border border-[var(--border-primary)] shadow-[var(--shadow-md)]': variant === 'elevated',
            'border border-[var(--border-subtle)]': variant === 'outlined',
          },
          // Padding styles
          {
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
            'p-10': padding === 'xl',
          },
          // Hover effect
          hoverable && [
            'cursor-pointer',
            'hover:border-[var(--border-hover)]',
            'hover:shadow-[var(--shadow-lg)]',
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
