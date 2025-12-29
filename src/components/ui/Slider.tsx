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
      <div className={clsx('flex flex-col gap-3', fullWidth && 'w-full')}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={sliderId}
                className="font-body text-[11px] uppercase tracking-[0.08em] text-[var(--text-secondary)]"
              >
                {label}
              </label>
            )}
            {showValue && (
              <span className="font-mono text-[12px] text-[var(--text-primary)]">
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
            'appearance-none h-3 bg-[var(--bg-tertiary)] cursor-pointer',
            'border-2 border-[var(--border-primary)]',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:bg-[var(--bg-inverse)] [&::-webkit-slider-thumb]:border-2',
            '[&::-webkit-slider-thumb]:border-[var(--border-primary)] [&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:hover:bg-[var(--accent)] [&::-webkit-slider-thumb]:transition-colors',
            '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
            '[&::-moz-range-thumb]:bg-[var(--bg-inverse)] [&::-moz-range-thumb]:border-2',
            '[&::-moz-range-thumb]:border-[var(--border-primary)] [&::-moz-range-thumb]:cursor-pointer',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
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
