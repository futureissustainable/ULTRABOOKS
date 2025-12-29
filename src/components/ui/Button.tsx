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
          'font-body uppercase tracking-wider',
          'border-2 border-[var(--border-primary)]',
          'transition-all duration-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
          // Variant styles
          {
            // Primary - Black fill, white text
            'bg-[var(--bg-inverse)] text-[var(--text-inverse)] hover:bg-[var(--accent)] hover:border-[var(--accent)]':
              variant === 'primary',
            // Secondary - White fill, black text
            'bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]':
              variant === 'secondary',
            // Ghost - Transparent, border on hover
            'bg-transparent text-[var(--text-primary)] border-transparent hover:border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]':
              variant === 'ghost',
            // Danger - Red accent
            'bg-[var(--accent)] text-white border-[var(--accent)] hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)]':
              variant === 'danger',
          },
          // Size styles - more generous padding
          {
            'px-4 py-2 text-[11px] gap-1.5': size === 'sm',
            'px-6 py-3 text-[12px] gap-2': size === 'md',
            'px-8 py-4 text-[13px] gap-2.5': size === 'lg',
          },
          // Shadow and hover effect (only if not disabled)
          !disabled && variant !== 'ghost' && [
            'shadow-[3px_3px_0_var(--border-primary)]',
            'hover:shadow-[1px_1px_0_var(--border-primary)]',
            'hover:translate-x-[2px] hover:translate-y-[2px]',
            'active:shadow-none active:translate-x-[3px] active:translate-y-[3px]',
          ],
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
