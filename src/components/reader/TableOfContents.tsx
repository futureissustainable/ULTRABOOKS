'use client';

import { clsx } from 'clsx';
import { useReaderStore } from '@/lib/stores/reader-store';
import { Modal } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';

interface TocItem {
  id: string;
  href: string;
  label: string;
  subitems?: TocItem[];
}

interface TableOfContentsProps {
  items: TocItem[];
  currentHref?: string;
  onNavigate: (href: string) => void;
}

function TocItemComponent({
  item,
  currentHref,
  onNavigate,
  level = 0,
}: {
  item: TocItem;
  currentHref?: string;
  onNavigate: (href: string) => void;
  level?: number;
}) {
  const isActive = currentHref === item.href;

  return (
    <li>
      <button
        onClick={() => onNavigate(item.href)}
        className={clsx(
          'w-full text-left py-2 px-3 font-ui text-sm transition-colors',
          'hover:bg-[var(--bg-tertiary)]',
          isActive && 'bg-[var(--bg-tertiary)] font-bold',
          level > 0 && 'pl-6'
        )}
        style={{ paddingLeft: `${(level + 1) * 12}px` }}
      >
        {item.label}
      </button>
      {item.subitems && item.subitems.length > 0 && (
        <ul>
          {item.subitems.map((subitem) => (
            <TocItemComponent
              key={subitem.id}
              item={subitem}
              currentHref={currentHref}
              onNavigate={onNavigate}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TableOfContents({ items, currentHref, onNavigate }: TableOfContentsProps) {
  const { isTocOpen, setTocOpen } = useReaderStore();

  const handleNavigate = (href: string) => {
    onNavigate(href);
    setTocOpen(false);
  };

  return (
    <Modal
      isOpen={isTocOpen}
      onClose={() => setTocOpen(false)}
      title="Table of Contents"
      size="md"
    >
      {items.length === 0 ? (
        <div className="py-8 text-center">
          <PixelIcon name="book" size={32} className="mx-auto mb-2 text-[var(--text-tertiary)]" />
          <p className="font-ui text-sm text-[var(--text-secondary)]">
            No table of contents available
          </p>
        </div>
      ) : (
        <ul className="max-h-[60vh] overflow-y-auto -mx-4">
          {items.map((item) => (
            <TocItemComponent
              key={item.id}
              item={item}
              currentHref={currentHref}
              onNavigate={handleNavigate}
            />
          ))}
        </ul>
      )}
    </Modal>
  );
}
