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
        <div className="container-narrow py-12 md:py-16">
          <div className="mb-12">
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-3">
              Configuration
            </p>
            <h1 className="font-heading">Settings</h1>
          </div>

          <div className="space-y-10">
            {/* Account Settings */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-[var(--bg-inverse)] flex items-center justify-center">
                  <PixelIcon name="user" size={20} className="text-[var(--text-inverse)]" />
                </div>
                <h2 className="font-heading text-lg">Account</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-body text-[11px] uppercase tracking-[0.08em] text-[var(--text-secondary)] block mb-2">
                    Email
                  </label>
                  <p className="font-mono text-[13px]">{user?.email}</p>
                </div>

                <Input
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  fullWidth
                />

                <div className="flex items-center gap-4">
                  <Button onClick={handleProfileSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  {saveSuccess && (
                    <span className="font-body text-[12px] text-[var(--success)] flex items-center gap-1.5">
                      <PixelIcon name="check" size={16} />
                      Saved!
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* Reader Settings */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-[var(--bg-inverse)] flex items-center justify-center">
                  <PixelIcon name="book-open" size={20} className="text-[var(--text-inverse)]" />
                </div>
                <h2 className="font-heading text-lg">Reader</h2>
              </div>

              <div className="space-y-8">
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

                <p className="font-body text-[11px] text-[var(--text-tertiary)]">
                  Settings sync across all your devices.
                </p>
              </div>
            </Card>

            {/* Data & Privacy */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-[var(--bg-inverse)] flex items-center justify-center">
                  <PixelIcon name="sync" size={20} className="text-[var(--text-inverse)]" />
                </div>
                <h2 className="font-heading text-lg">Data & Sync</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-[var(--border-subtle)]">
                  <div>
                    <p className="font-body text-[13px] font-bold mb-1">Reading Progress</p>
                    <p className="font-body text-[11px] text-[var(--text-secondary)]">
                      Synced automatically
                    </p>
                  </div>
                  <PixelIcon name="check" size={20} className="text-[var(--success)]" />
                </div>

                <div className="flex items-center justify-between p-4 border border-[var(--border-subtle)]">
                  <div>
                    <p className="font-body text-[13px] font-bold mb-1">Bookmarks</p>
                    <p className="font-body text-[11px] text-[var(--text-secondary)]">
                      Synced automatically
                    </p>
                  </div>
                  <PixelIcon name="check" size={20} className="text-[var(--success)]" />
                </div>

                <div className="flex items-center justify-between p-4 border border-[var(--border-subtle)]">
                  <div>
                    <p className="font-body text-[13px] font-bold mb-1">Highlights</p>
                    <p className="font-body text-[11px] text-[var(--text-secondary)]">
                      Synced automatically
                    </p>
                  </div>
                  <PixelIcon name="check" size={20} className="text-[var(--success)]" />
                </div>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card variant="outlined" padding="lg" className="border-2 border-[var(--accent)]">
              <h2 className="font-heading text-lg mb-6 text-[var(--accent)]">
                Danger Zone
              </h2>

              <Button variant="danger" onClick={handleSignOut}>
                <PixelIcon name="logout" size={16} className="mr-2" />
                Sign Out
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
