'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useReaderStore } from '@/lib/stores/reader-store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, Button, Input, Select, Slider, Toggle } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, updateProfile, signOut } = useAuthStore();
  const { settings, updateSettings, syncSettings, loadSettings } = useReaderStore();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile]);

  const handleProfileSave = async () => {
    setIsSaving(true);
    await updateProfile({ display_name: displayName || null });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleReaderSettingChange = (key: string, value: string | number) => {
    updateSettings({ [key]: value });
    syncSettings();
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const fontOptions = [
    { value: 'Georgia', label: 'Georgia (Serif)' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Arial', label: 'Arial (Sans)' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Courier New', label: 'Courier New (Mono)' },
  ];

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'sepia', label: 'Sepia' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="font-display text-3xl uppercase mb-8">Settings</h1>

          <div className="space-y-8">
            {/* Account Settings */}
            <Card variant="elevated" padding="lg">
              <h2 className="font-display text-xl uppercase mb-6 flex items-center gap-2">
                <PixelIcon name="user" size={20} />
                Account
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="font-ui text-xs uppercase tracking-wide text-[var(--text-secondary)] block mb-1">
                    Email
                  </label>
                  <p className="font-mono text-sm">{user?.email}</p>
                </div>

                <Input
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  fullWidth
                />

                <div className="flex items-center gap-3">
                  <Button onClick={handleProfileSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  {saveSuccess && (
                    <span className="font-ui text-sm text-[var(--color-success)]">
                      <PixelIcon name="check" size={16} className="inline mr-1" />
                      Saved!
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* Reader Settings */}
            <Card variant="elevated" padding="lg">
              <h2 className="font-display text-xl uppercase mb-6 flex items-center gap-2">
                <PixelIcon name="book-open" size={20} />
                Reader Preferences
              </h2>

              <div className="space-y-6">
                <Select
                  label="Default Theme"
                  options={themeOptions}
                  value={settings.theme}
                  onChange={(e) => handleReaderSettingChange('theme', e.target.value)}
                  fullWidth
                />

                <Select
                  label="Default Font"
                  options={fontOptions}
                  value={settings.fontFamily}
                  onChange={(e) => handleReaderSettingChange('fontFamily', e.target.value)}
                  fullWidth
                />

                <Slider
                  label="Default Font Size"
                  min={12}
                  max={32}
                  step={1}
                  value={settings.fontSize}
                  onChange={(e) => handleReaderSettingChange('fontSize', Number(e.target.value))}
                  showValue
                  fullWidth
                />

                <Slider
                  label="Line Height"
                  min={1.2}
                  max={2.5}
                  step={0.1}
                  value={settings.lineHeight}
                  onChange={(e) => handleReaderSettingChange('lineHeight', Number(e.target.value))}
                  showValue
                  fullWidth
                />

                <Slider
                  label="Margins"
                  min={0}
                  max={100}
                  step={5}
                  value={settings.margins}
                  onChange={(e) => handleReaderSettingChange('margins', Number(e.target.value))}
                  showValue
                  fullWidth
                />

                <p className="font-ui text-xs text-[var(--text-tertiary)]">
                  These settings are synced across all your devices.
                </p>
              </div>
            </Card>

            {/* Data & Privacy */}
            <Card variant="elevated" padding="lg">
              <h2 className="font-display text-xl uppercase mb-6 flex items-center gap-2">
                <PixelIcon name="sync" size={20} />
                Data & Sync
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)]">
                  <div>
                    <p className="font-ui text-sm font-bold">Reading Progress</p>
                    <p className="font-ui text-xs text-[var(--text-secondary)]">
                      Synced automatically
                    </p>
                  </div>
                  <PixelIcon name="check" size={20} className="text-[var(--color-success)]" />
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)]">
                  <div>
                    <p className="font-ui text-sm font-bold">Bookmarks</p>
                    <p className="font-ui text-xs text-[var(--text-secondary)]">
                      Synced automatically
                    </p>
                  </div>
                  <PixelIcon name="check" size={20} className="text-[var(--color-success)]" />
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)]">
                  <div>
                    <p className="font-ui text-sm font-bold">Highlights</p>
                    <p className="font-ui text-xs text-[var(--text-secondary)]">
                      Synced automatically
                    </p>
                  </div>
                  <PixelIcon name="check" size={20} className="text-[var(--color-success)]" />
                </div>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card variant="outlined" padding="lg" className="border-[var(--color-accent)]">
              <h2 className="font-display text-xl uppercase mb-6 text-[var(--color-accent)]">
                Danger Zone
              </h2>

              <div className="space-y-4">
                <Button variant="danger" onClick={handleSignOut}>
                  <PixelIcon name="logout" size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
