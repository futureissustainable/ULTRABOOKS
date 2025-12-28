'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { useReaderStore } from '@/lib/stores/reader-store';
import { Modal, Button, Input } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';

interface HighlightsListProps {
  onNavigate: (location: string) => void;
}

const highlightColors = [
  { name: 'yellow', class: 'bg-yellow-300' },
  { name: 'green', class: 'bg-green-300' },
  { name: 'blue', class: 'bg-blue-300' },
  { name: 'red', class: 'bg-red-300' },
];

export function HighlightsList({ onNavigate }: HighlightsListProps) {
  const {
    highlights,
    removeHighlight,
    updateHighlightNote,
    updateHighlightColor,
    isHighlightsOpen,
    setHighlightsOpen,
  } = useReaderStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  const handleNavigate = (location: string) => {
    onNavigate(location);
    setHighlightsOpen(false);
  };

  const handleStartEdit = (id: string, currentNote: string | null) => {
    setEditingId(id);
    setEditNote(currentNote || '');
  };

  const handleSaveNote = async (id: string) => {
    await updateHighlightNote(id, editNote);
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
      isOpen={isHighlightsOpen}
      onClose={() => setHighlightsOpen(false)}
      title="Highlights"
      size="md"
    >
      {highlights.length === 0 ? (
        <div className="py-8 text-center">
          <PixelIcon name="highlight" size={32} className="mx-auto mb-2 text-[var(--text-tertiary)]" />
          <p className="font-ui text-sm text-[var(--text-secondary)]">
            No highlights yet. Select text while reading to highlight it.
          </p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
          {highlights.map((highlight) => (
            <li
              key={highlight.id}
              className="border-2 border-[var(--border-primary)] p-3"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <button
                  onClick={() => handleNavigate(highlight.cfi_range)}
                  className="flex-1 text-left"
                >
                  <p
                    className={clsx(
                      'font-ui text-sm px-1 inline',
                      highlight.color === 'yellow' && 'bg-yellow-200',
                      highlight.color === 'green' && 'bg-green-200',
                      highlight.color === 'blue' && 'bg-blue-200',
                      highlight.color === 'red' && 'bg-red-200'
                    )}
                  >
                    &ldquo;{highlight.text}&rdquo;
                  </p>
                </button>
              </div>

              {/* Color Picker */}
              <div className="flex items-center gap-2 mb-2">
                {highlightColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => updateHighlightColor(highlight.id, color.name)}
                    className={clsx(
                      'w-5 h-5 border-2',
                      color.class,
                      highlight.color === color.name
                        ? 'border-[var(--border-primary)]'
                        : 'border-transparent hover:border-[var(--border-secondary)]'
                    )}
                    aria-label={`Change to ${color.name}`}
                  />
                ))}
                <div className="flex-1" />
                <button
                  onClick={() => handleStartEdit(highlight.id, highlight.note)}
                  className="p-1 hover:text-[var(--color-accent)]"
                  aria-label="Edit note"
                >
                  <PixelIcon name="edit" size={14} />
                </button>
                <button
                  onClick={() => removeHighlight(highlight.id)}
                  className="p-1 hover:text-[var(--color-accent)]"
                  aria-label="Remove highlight"
                >
                  <PixelIcon name="trash" size={14} />
                </button>
              </div>

              {editingId === highlight.id ? (
                <div className="space-y-2">
                  <Input
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Add a note..."
                    fullWidth
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveNote(highlight.id)}>
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
              ) : highlight.note ? (
                <p className="font-ui text-xs text-[var(--text-secondary)] italic">
                  {highlight.note}
                </p>
              ) : null}

              <p className="font-mono text-[10px] text-[var(--text-tertiary)] mt-2">
                {formatDate(highlight.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
