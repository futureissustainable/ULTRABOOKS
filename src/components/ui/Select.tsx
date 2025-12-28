'use client';

import { clsx } from 'clsx';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, fullWidth, id, options, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="font-ui text-xs uppercase tracking-wide text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'font-ui px-4 py-2 text-sm appearance-none cursor-pointer',
            'bg-[var(--bg-primary)] text-[var(--text-primary)]',
            'border-2 border-[var(--border-primary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'currentColor\'%3E%3Cpath d=\'M4 10l8 8 8-8-2-2-6 6-6-6-2 2z\'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center]',
            error && 'border-[var(--color-accent)]',
            fullWidth && 'w-full',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="font-ui text-xs text-[var(--color-accent)]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
