'use client';

import { useState, useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import { useBookStore } from '@/lib/stores/book-store';
import { Button, Modal } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';

interface BookUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookUpload({ isOpen, onClose }: BookUploadProps) {
  const { uploadBook, isLoading } = useBookStore();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = ['.epub', '.pdf', '.mobi'];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      setError(`Invalid file type. Accepted formats: ${acceptedTypes.join(', ')}`);
      return false;
    }
    // Max 100MB
    if (file.size > 100 * 1024 * 1024) {
      setError('File too large. Maximum size is 100MB.');
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setUploadedFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setUploadedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    const result = await uploadBook(uploadedFile);
    if (result.error) {
      setError(result.error);
    } else {
      setUploadedFile(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setUploadedFile(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Upload Book" size="md">
      <div className="space-y-4">
        {!uploadedFile ? (
          <>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={clsx(
                'border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
                isDragging
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                  : 'border-[var(--border-primary)] hover:border-[var(--text-secondary)]'
              )}
            >
              <PixelIcon
                name="upload"
                size={48}
                className={clsx(
                  'mx-auto mb-4',
                  isDragging ? 'text-[var(--color-accent)]' : 'text-[var(--text-tertiary)]'
                )}
              />
              <p className="font-ui text-sm mb-2">
                Drop your file here or click to browse
              </p>
              <p className="font-mono text-xs text-[var(--text-tertiary)]">
                EPUB, PDF, MOBI (max 100MB)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
          </>
        ) : (
          <div className="border-2 border-[var(--border-primary)] p-4">
            <div className="flex items-center gap-3">
              <PixelIcon name="book" size={32} />
              <div className="flex-1 min-w-0">
                <p className="font-ui text-sm font-bold truncate">{uploadedFile.name}</p>
                <p className="font-mono text-xs text-[var(--text-secondary)]">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                className="p-1 hover:text-[var(--color-accent)]"
              >
                <PixelIcon name="close" size={16} />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10">
            <p className="font-ui text-sm text-[var(--color-accent)]">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={handleUpload}
            disabled={!uploadedFile || isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
