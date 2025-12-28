'use client';

import { clsx } from 'clsx';
import { InputHTMLAttributes, forwardRef } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  fullWidth?: boolean;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, showValue, fullWidth, id, value, ...props }, ref) => {
    const sliderId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={clsx('flex flex-col gap-2', fullWidth && 'w-full')}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={sliderId}
                className="font-ui text-xs uppercase tracking-wide text-[var(--text-secondary)]"
              >
                {label}
              </label>
            )}
            {showValue && (
              <span className="font-mono text-sm text-[var(--text-primary)]">
                {value}
              </span>
            )}
          </div>
        )}
        <input
          ref={ref}
          id={sliderId}
          type="range"
          value={value}
          className={clsx(
            'appearance-none h-2 bg-[var(--bg-tertiary)] cursor-pointer',
            'border-2 border-[var(--border-primary)]',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:bg-[var(--bg-inverse)] [&::-webkit-slider-thumb]:border-2',
            '[&::-webkit-slider-thumb]:border-[var(--border-primary)] [&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:hover:bg-[var(--color-accent)]',
            '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:bg-[var(--bg-inverse)] [&::-moz-range-thumb]:border-2',
            '[&::-moz-range-thumb]:border-[var(--border-primary)] [&::-moz-range-thumb]:cursor-pointer',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
            fullWidth && 'w-full',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
