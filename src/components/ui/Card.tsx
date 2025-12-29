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
          // Variant styles
          {
            'border-2 border-[var(--border-primary)]': variant === 'default' || variant === 'elevated',
            'shadow-[4px_4px_0_var(--border-primary)]': variant === 'elevated',
            'border border-[var(--border-subtle)]': variant === 'outlined',
          },
          // Padding styles - more generous
          {
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
            'p-10': padding === 'xl',
          },
          // Hover effect
          hoverable && [
            'transition-all duration-100',
            'cursor-pointer',
            'hover:translate-x-[-2px] hover:translate-y-[-2px]',
            'hover:shadow-[6px_6px_0_var(--border-primary)]',
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
