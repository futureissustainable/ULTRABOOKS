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
      <div className={clsx('flex flex-col gap-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-[11px] uppercase tracking-[0.08em] text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'font-body px-4 py-3 text-[13px]',
            'bg-[var(--bg-primary)] text-[var(--text-primary)]',
            'border-2 border-[var(--border-primary)]',
            'placeholder:text-[var(--text-tertiary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-colors duration-100',
            error && 'border-[var(--accent)] focus:ring-[var(--accent)]',
            fullWidth && 'w-full',
            className
          )}
          {...props}
        />
        {error && (
          <span className="font-body text-[11px] text-[var(--accent)]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
