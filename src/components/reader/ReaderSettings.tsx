'use client';

import { clsx } from 'clsx';
import { useReaderStore } from '@/lib/stores/reader-store';
import { READER_THEME_COLORS, type ReaderTheme } from '@/lib/constants/reader-theme';
import { Modal } from '@/components/ui';

export function ReaderSettings() {
  const {
    settings,
    updateSettings,
    syncSettings,
    isSettingsOpen,
    setSettingsOpen,
  } = useReaderStore();

  const handleChange = (key: string, value: string | number) => {
    updateSettings({ [key]: value });
    syncSettings();
  };

  return (
    <Modal
      isOpen={isSettingsOpen}
      onClose={() => setSettingsOpen(false)}
      title="Settings"
      size="sm"
    >
      <div className="space-y-6">
        {/* Theme */}
        <div>
          <label className="font-ui fs-p-sm uppercase tracking-[0.05em] text-[var(--text-tertiary)] mb-3 block">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'sepia'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleChange('theme', theme)}
                className={clsx(
                  'relative p-3 border transition-all duration-100',
                  settings.theme === theme
                    ? 'border-[var(--text-primary)]'
                    : 'border-[var(--border-primary)] hover:border-[var(--border-strong)]'
                )}
              >
                <div
                  className="w-full h-6 mb-2 flex items-center justify-center"
                  style={{
                    backgroundColor: READER_THEME_COLORS[theme].bg,
                    color: READER_THEME_COLORS[theme].text
                  }}
                >
                  <span className="fs-p-sm">Aa</span>
                </div>
                <span className="font-ui fs-p-sm uppercase block text-center capitalize">
                  {theme}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="font-ui fs-p-sm uppercase tracking-[0.05em] text-[var(--text-tertiary)]">
              Text Size
            </label>
            <span className="font-mono fs-p-sm text-[var(--text-secondary)]">
              {settings.fontSize}px
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleChange('fontSize', Math.max(12, settings.fontSize - 2))}
              className="w-10 h-10 flex items-center justify-center border border-[var(--border-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors font-mono fs-h-sm"
            >
              −
            </button>
            <div className="flex-1 h-2 bg-[var(--bg-tertiary)] relative">
              <div
                className="h-full bg-[var(--text-primary)] transition-all"
                style={{ width: `${((settings.fontSize - 12) / 20) * 100}%` }}
              />
            </div>
            <button
              onClick={() => handleChange('fontSize', Math.min(32, settings.fontSize + 2))}
              className="w-10 h-10 flex items-center justify-center border border-[var(--border-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors font-mono fs-h-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Line Spacing */}
        <div>
          <label className="font-ui fs-p-sm uppercase tracking-[0.05em] text-[var(--text-tertiary)] mb-3 block">
            Line Spacing
          </label>
          <div className="flex gap-2">
            {[
              { value: 1.4, label: 'Tight' },
              { value: 1.8, label: 'Normal' },
              { value: 2.2, label: 'Relaxed' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleChange('lineHeight', option.value)}
                className={clsx(
                  'flex-1 py-2 border transition-all duration-100 font-ui fs-p-sm uppercase',
                  settings.lineHeight === option.value
                    ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'border-[var(--border-primary)] hover:border-[var(--border-strong)]'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
