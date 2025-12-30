'use client';

import { clsx } from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium',
          'rounded-lg',
          'transition-all duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Variant styles
          {
            // Primary - Filled accent
            'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-[0.98]':
              variant === 'primary' && !disabled,
            'bg-[var(--accent)] text-white':
              variant === 'primary' && disabled,
            // Secondary - Subtle background
            'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] active:scale-[0.98]':
              variant === 'secondary' && !disabled,
            'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)]':
              variant === 'secondary' && disabled,
            // Ghost - Transparent
            'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]':
              variant === 'ghost',
            // Danger - Red
            'bg-[var(--error)] text-white hover:bg-red-600 active:scale-[0.98]':
              variant === 'danger' && !disabled,
            'bg-[var(--error)] text-white':
              variant === 'danger' && disabled,
          },
          // Size styles
          {
            'px-3 py-1.5 text-sm gap-1.5': size === 'sm',
            'px-4 py-2 text-sm gap-2': size === 'md',
            'px-6 py-3 text-base gap-2': size === 'lg',
          },
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
