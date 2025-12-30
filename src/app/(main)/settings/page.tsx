'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useReaderStore } from '@/lib/stores/reader-store';
import { useBookStore } from '@/lib/stores/book-store';
import { useThemeStore } from '@/lib/stores/theme-store';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, Button, Input, Select, Slider, Toggle } from '@/components/ui';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, updateProfile, signOut } = useAuthStore();
  const { settings, updateSettings, syncSettings, loadSettings } = useReaderStore();
  const { books, fetchBooks } = useBookStore();
  const { theme, setTheme } = useThemeStore();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadSettings();
    fetchBooks();
  }, [loadSettings, fetchBooks]);

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

  const handleExportData = async () => {
    if (!user) return;
    setIsExporting(true);

    try {
      const supabase = createClient();

      // Fetch all user data
      const [bookmarksRes, highlightsRes, progressRes, settingsRes] = await Promise.all([
        supabase.from('bookmarks').select('*').eq('user_id', user.id),
        supabase.from('highlights').select('*').eq('user_id', user.id),
        supabase.from('reading_progress').select('*').eq('user_id', user.id),
        supabase.from('user_settings').select('*').eq('user_id', user.id).single(),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          email: user.email,
          displayName: profile?.display_name,
        },
        books: books.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          fileType: book.file_type,
          fileSize: book.file_size,
          createdAt: book.created_at,
        })),
        bookmarks: bookmarksRes.data || [],
        highlights: highlightsRes.data || [],
        readingProgress: progressRes.data || [],
        settings: settingsRes.data || settings,
      };

      // Create and download the file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ultrabooks-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const fontOptions = [
    { value: 'Georgia', label: 'Georgia (Serif)' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Arial', label: 'Arial (Sans)' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Courier New', label: 'Courier New (Mono)' },
  ];

  const readerThemeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'sepia', label: 'Sepia' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header />

      <main className="flex-1">
        <div className="container-narrow py-10 md:py-16">
          <div className="mb-10">
            <h1 className="text-2xl font-bold mb-2">Settings</h1>
            <p className="text-[var(--text-secondary)]">
              Manage your account and reading preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Account Settings */}
            <Card variant="default" padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">Account</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">
                    Email
                  </label>
                  <p className="text-sm">{user?.email}</p>
                </div>

                <Input
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  fullWidth
                />

                <div className="flex items-center gap-3">
                  <Button onClick={handleProfileSave} disabled={isSaving} size="sm">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  {saveSuccess && (
                    <span className="text-sm text-[var(--success)] flex items-center gap-1.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Saved!
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* Appearance */}
            <Card variant="default" padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">Appearance</h2>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1">Dark Mode</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Toggle
                  checked={theme === 'dark'}
                  onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </Card>

            {/* Reader Settings */}
            <Card variant="default" padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">Reader</h2>
              </div>

              <div className="space-y-6">
                <Select
                  label="Reader Theme"
                  options={readerThemeOptions}
                  value={settings.theme}
                  onChange={(e) => handleReaderSettingChange('theme', e.target.value)}
                  fullWidth
                />

                <Select
                  label="Font Family"
                  options={fontOptions}
                  value={settings.fontFamily}
                  onChange={(e) => handleReaderSettingChange('fontFamily', e.target.value)}
                  fullWidth
                />

                <Slider
                  label="Font Size"
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

                <p className="text-xs text-[var(--text-tertiary)]">
                  Reader settings sync across all your devices.
                </p>
              </div>
            </Card>

            {/* Data & Export */}
            <Card variant="default" padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">Data & Export</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl">
                  <div>
                    <p className="text-sm font-medium mb-1">Cloud Sync</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      All data syncs automatically across devices
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--success)]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-xs font-medium">Active</span>
                  </div>
                </div>

                <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Export All Data</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Download your books, bookmarks, highlights, and settings
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleExportData} disabled={isExporting}>
                    {isExporting ? 'Exporting...' : 'Export as JSON'}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-[var(--bg-secondary)] rounded-xl">
                    <p className="text-lg font-semibold">{books.length}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Books</p>
                  </div>
                  <div className="p-3 bg-[var(--bg-secondary)] rounded-xl">
                    <p className="text-lg font-semibold">-</p>
                    <p className="text-xs text-[var(--text-secondary)]">Bookmarks</p>
                  </div>
                  <div className="p-3 bg-[var(--bg-secondary)] rounded-xl">
                    <p className="text-lg font-semibold">-</p>
                    <p className="text-xs text-[var(--text-secondary)]">Highlights</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sign Out */}
            <Card variant="default" padding="lg" className="border-[var(--error)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--error)] mb-1">Sign Out</h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    You can sign back in anytime
                  </p>
                </div>
                <Button variant="danger" size="sm" onClick={handleSignOut}>
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
