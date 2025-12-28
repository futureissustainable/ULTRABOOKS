'use client';

import { clsx } from 'clsx';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  return (
    <label
      className={clsx(
        'flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          'relative w-12 h-6 border-2 border-[var(--border-primary)] transition-colors',
          checked ? 'bg-[var(--bg-inverse)]' : 'bg-[var(--bg-secondary)]'
        )}
      >
        <span
          className={clsx(
            'absolute top-0 w-4 h-4 m-[2px] border-2 border-[var(--border-primary)] transition-transform',
            checked
              ? 'translate-x-6 bg-[var(--bg-primary)]'
              : 'translate-x-0 bg-[var(--bg-inverse)]'
          )}
        />
      </button>
      {label && (
        <span className="font-ui text-sm uppercase tracking-wide">
          {label}
        </span>
      )}
    </label>
  );
}
