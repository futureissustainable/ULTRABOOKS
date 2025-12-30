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
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'px-4 py-2.5 text-[15px]',
            'bg-[var(--bg-primary)] text-[var(--text-primary)]',
            'border border-[var(--border-primary)] rounded-lg',
            'placeholder:text-[var(--text-tertiary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--bg-secondary)]',
            'transition-all duration-150',
            error && 'border-[var(--error)] focus:ring-[var(--error)]',
            fullWidth && 'w-full',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-sm text-[var(--error)]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
