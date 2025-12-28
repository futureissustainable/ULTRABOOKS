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
          'font-ui uppercase tracking-wide transition-all duration-100',
          'border-2 border-[var(--border-primary)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
          // Variant styles
          {
            'bg-[var(--bg-inverse)] text-[var(--text-inverse)] hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)]':
              variant === 'primary',
            'bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]':
              variant === 'secondary',
            'bg-transparent text-[var(--text-primary)] border-transparent hover:border-[var(--border-primary)]':
              variant === 'ghost',
            'bg-[var(--color-accent)] text-white border-[var(--color-accent)] hover:bg-[var(--color-accent-muted)]':
              variant === 'danger',
          },
          // Size styles
          {
            'px-3 py-1 text-xs': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          // Shadow and hover effect
          !disabled && 'shadow-[4px_4px_0_var(--border-primary)] hover:shadow-[2px_2px_0_var(--border-primary)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
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
