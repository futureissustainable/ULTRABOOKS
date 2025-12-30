'use client';

import { useState } from 'react';
import { Modal, Button, Toggle } from '@/components/ui';
import { useShareStore } from '@/lib/stores/share-store';
import type { Book } from '@/lib/supabase/types';

interface ShareModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ book, isOpen, onClose }: ShareModalProps) {
  const { createShare, isCreating } = useShareStore();
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    includeBookmarks: true,
    includeHighlights: true,
    includeNotes: false,
  });

  const handleCreateShare = async () => {
    const { shareCode, error } = await createShare(book.id, options);

    if (shareCode && !error) {
      const link = `${window.location.origin}/share/${shareCode}`;
      setShareLink(link);
    }
  };

  const handleCopyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setShareLink(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Share Book" size="md">
      <div className="space-y-6">
        {!shareLink ? (
          <>
            <div className="flex items-start gap-4 p-4 bg-[var(--bg-secondary)] rounded-xl">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-16 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--text-primary)] truncate">{book.title}</h3>
                {book.author && (
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{book.author}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[var(--text-primary)]">Include with share</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Bookmarks</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Share your saved bookmarks</p>
                  </div>
                  <Toggle
                    checked={options.includeBookmarks}
                    onChange={(checked) => setOptions({ ...options, includeBookmarks: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Highlights</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Share your highlighted passages</p>
                  </div>
                  <Toggle
                    checked={options.includeHighlights}
                    onChange={(checked) => setOptions({ ...options, includeHighlights: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Share your personal notes</p>
                  </div>
                  <Toggle
                    checked={options.includeNotes}
                    onChange={(checked) => setOptions({ ...options, includeNotes: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={handleClose}>
                Cancel
              </Button>
              <Button fullWidth onClick={handleCreateShare} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Share Link'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Share link created!</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Anyone with this link can view your book and annotations.
              </p>
            </div>

            <div className="flex items-center gap-2 p-3 bg-[var(--bg-secondary)] rounded-lg">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 bg-transparent text-sm outline-none truncate"
              />
              <Button size="sm" onClick={handleCopyLink}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={handleClose}>
                Done
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
