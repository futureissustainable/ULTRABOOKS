'use client';

import { clsx } from 'clsx';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hoverable, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bg-[var(--bg-primary)]',
          // Variant styles
          {
            'border-2 border-[var(--border-primary)]': variant === 'default' || variant === 'elevated',
            'shadow-[4px_4px_0_var(--border-primary)]': variant === 'elevated',
            'border border-[var(--border-secondary)]': variant === 'outlined',
          },
          // Padding styles
          {
            'p-0': padding === 'none',
            'p-3': padding === 'sm',
            'p-4': padding === 'md',
            'p-6': padding === 'lg',
          },
          // Hover effect
          hoverable && 'transition-all duration-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--border-primary)] cursor-pointer',
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
