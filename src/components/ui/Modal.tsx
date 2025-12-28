'use client';

import { clsx } from 'clsx';
import { useEffect, useCallback, ReactNode } from 'react';
import { PixelIcon } from '../icons/PixelIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={clsx(
          'relative z-10 bg-[var(--bg-primary)] border-2 border-[var(--border-primary)]',
          'shadow-[8px_8px_0_var(--border-primary)]',
          'max-h-[90vh] overflow-hidden flex flex-col',
          {
            'w-full max-w-sm': size === 'sm',
            'w-full max-w-lg': size === 'md',
            'w-full max-w-2xl': size === 'lg',
            'w-[95vw] h-[90vh]': size === 'full',
          }
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b-2 border-[var(--border-primary)]">
            <h2 className="font-display text-lg uppercase">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:text-[var(--color-accent)] transition-colors"
              aria-label="Close modal"
            >
              <PixelIcon name="close" size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
