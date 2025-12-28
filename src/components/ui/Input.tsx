'use client';

import { clsx } from 'clsx';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fullWidth, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-ui text-xs uppercase tracking-wide text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'font-ui px-4 py-2 text-sm',
            'bg-[var(--bg-primary)] text-[var(--text-primary)]',
            'border-2 border-[var(--border-primary)]',
            'placeholder:text-[var(--text-tertiary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[var(--color-accent)]',
            fullWidth && 'w-full',
            className
          )}
          {...props}
        />
        {error && (
          <span className="font-ui text-xs text-[var(--color-accent)]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
