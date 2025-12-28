'use client';

import { useState } from 'react';
import { useReaderStore } from '@/lib/stores/reader-store';
import { Modal, Button, Input } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';

interface BookmarksListProps {
  onNavigate: (location: string) => void;
}

export function BookmarksList({ onNavigate }: BookmarksListProps) {
  const {
    bookmarks,
    removeBookmark,
    updateBookmarkNote,
    isBookmarksOpen,
    setBookmarksOpen,
  } = useReaderStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  const handleNavigate = (location: string) => {
    onNavigate(location);
    setBookmarksOpen(false);
  };

  const handleStartEdit = (id: string, currentNote: string | null) => {
    setEditingId(id);
    setEditNote(currentNote || '');
  };

  const handleSaveNote = async (id: string) => {
    await updateBookmarkNote(id, editNote);
    setEditingId(null);
    setEditNote('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      isOpen={isBookmarksOpen}
      onClose={() => setBookmarksOpen(false)}
      title="Bookmarks"
      size="md"
    >
      {bookmarks.length === 0 ? (
        <div className="py-8 text-center">
          <PixelIcon name="bookmark" size={32} className="mx-auto mb-2 text-[var(--text-tertiary)]" />
          <p className="font-ui text-sm text-[var(--text-secondary)]">
            No bookmarks yet. Click the bookmark icon while reading to save your place.
          </p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.id}
              className="border-2 border-[var(--border-primary)] p-3"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <button
                  onClick={() => handleNavigate(bookmark.location)}
                  className="flex-1 text-left"
                >
                  <h4 className="font-ui text-sm font-bold hover:text-[var(--color-accent)] transition-colors">
                    {bookmark.title || 'Untitled Bookmark'}
                  </h4>
                  {bookmark.page && (
                    <span className="font-mono text-xs text-[var(--text-tertiary)]">
                      Page {bookmark.page}
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(bookmark.id, bookmark.note)}
                    className="p-1 hover:text-[var(--color-accent)]"
                    aria-label="Edit note"
                  >
                    <PixelIcon name="edit" size={14} />
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="p-1 hover:text-[var(--color-accent)]"
                    aria-label="Remove bookmark"
                  >
                    <PixelIcon name="trash" size={14} />
                  </button>
                </div>
              </div>

              {editingId === bookmark.id ? (
                <div className="space-y-2">
                  <Input
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Add a note..."
                    fullWidth
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveNote(bookmark.id)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : bookmark.note ? (
                <p className="font-ui text-xs text-[var(--text-secondary)] italic">
                  {bookmark.note}
                </p>
              ) : null}

              <p className="font-mono text-[10px] text-[var(--text-tertiary)] mt-2">
                {formatDate(bookmark.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
