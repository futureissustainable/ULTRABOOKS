import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { Bookmark, Highlight, ReadingProgress, UserSettings } from '@/lib/supabase/types';

interface ReaderSettings {
  theme: 'light' | 'dark' | 'sepia';
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  margins: number;
  textAlign: 'left' | 'justify';
}

interface ReaderState {
  // Settings
  settings: ReaderSettings;
  updateSettings: (settings: Partial<ReaderSettings>) => void;
  syncSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;

  // Reading progress
  currentLocation: string | null;
  currentPage: number | null;
  progressPercentage: number;
  updateProgress: (bookId: string, location: string, page?: number, percentage?: number) => Promise<void>;
  loadProgress: (bookId: string) => Promise<ReadingProgress | null>;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bookId: string, location: string, page?: number, title?: string) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  updateBookmarkNote: (id: string, note: string) => Promise<void>;
  loadBookmarks: (bookId: string) => Promise<void>;

  // Highlights
  highlights: Highlight[];
  addHighlight: (bookId: string, cfiRange: string, text: string, color?: string, page?: number) => Promise<void>;
  removeHighlight: (id: string) => Promise<void>;
  updateHighlightNote: (id: string, note: string) => Promise<void>;
  updateHighlightColor: (id: string, color: string) => Promise<void>;
  loadHighlights: (bookId: string) => Promise<void>;

  // UI State
  isTocOpen: boolean;
  isSettingsOpen: boolean;
  isBookmarksOpen: boolean;
  isHighlightsOpen: boolean;
  setTocOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setBookmarksOpen: (open: boolean) => void;
  setHighlightsOpen: (open: boolean) => void;
}

const defaultSettings: ReaderSettings = {
  theme: 'light',
  fontFamily: 'Georgia',
  fontSize: 18,
  lineHeight: 1.8,
  margins: 40,
  textAlign: 'left',
};

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      // Settings
      settings: defaultSettings,

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      syncSettings: async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { settings } = get();
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            theme: settings.theme,
            font_family: settings.fontFamily,
            font_size: settings.fontSize,
            line_height: settings.lineHeight,
            margins: settings.margins,
            text_align: settings.textAlign,
            updated_at: new Date().toISOString(),
          });
      },

      loadSettings: async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          set({
            settings: {
              theme: data.theme,
              fontFamily: data.font_family,
              fontSize: data.font_size,
              lineHeight: data.line_height,
              margins: data.margins,
              textAlign: data.text_align,
            },
          });
        }
      },

      // Reading progress
      currentLocation: null,
      currentPage: null,
      progressPercentage: 0,

      updateProgress: async (bookId, location, page, percentage) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        set({
          currentLocation: location,
          currentPage: page || null,
          progressPercentage: percentage || 0,
        });

        await supabase
          .from('reading_progress')
          .upsert({
            user_id: user.id,
            book_id: bookId,
            current_location: location,
            current_page: page,
            progress_percentage: percentage || 0,
            last_read_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      },

      loadProgress: async (bookId) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data } = await supabase
          .from('reading_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('book_id', bookId)
          .single();

        if (data) {
          set({
            currentLocation: data.current_location,
            currentPage: data.current_page,
            progressPercentage: data.progress_percentage,
          });
        }

        return data;
      },

      // Bookmarks
      bookmarks: [],

      addBookmark: async (bookId, location, page, title) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            book_id: bookId,
            location,
            page,
            title,
          })
          .select()
          .single();

        if (!error && data) {
          set((state) => ({
            bookmarks: [...state.bookmarks, data],
          }));
        }
      },

      removeBookmark: async (id) => {
        const supabase = createClient();
        await supabase.from('bookmarks').delete().eq('id', id);

        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        }));
      },

      updateBookmarkNote: async (id, note) => {
        const supabase = createClient();
        await supabase
          .from('bookmarks')
          .update({ note, updated_at: new Date().toISOString() })
          .eq('id', id);

        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, note } : b
          ),
        }));
      },

      loadBookmarks: async (bookId) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .eq('book_id', bookId)
          .order('created_at', { ascending: false });

        set({ bookmarks: data || [] });
      },

      // Highlights
      highlights: [],

      addHighlight: async (bookId, cfiRange, text, color = 'yellow', page) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('highlights')
          .insert({
            user_id: user.id,
            book_id: bookId,
            cfi_range: cfiRange,
            text,
            color,
            page,
          })
          .select()
          .single();

        if (!error && data) {
          set((state) => ({
            highlights: [...state.highlights, data],
          }));
        }
      },

      removeHighlight: async (id) => {
        const supabase = createClient();
        await supabase.from('highlights').delete().eq('id', id);

        set((state) => ({
          highlights: state.highlights.filter((h) => h.id !== id),
        }));
      },

      updateHighlightNote: async (id, note) => {
        const supabase = createClient();
        await supabase
          .from('highlights')
          .update({ note, updated_at: new Date().toISOString() })
          .eq('id', id);

        set((state) => ({
          highlights: state.highlights.map((h) =>
            h.id === id ? { ...h, note } : h
          ),
        }));
      },

      updateHighlightColor: async (id, color) => {
        const supabase = createClient();
        await supabase
          .from('highlights')
          .update({ color, updated_at: new Date().toISOString() })
          .eq('id', id);

        set((state) => ({
          highlights: state.highlights.map((h) =>
            h.id === id ? { ...h, color } : h
          ),
        }));
      },

      loadHighlights: async (bookId) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('highlights')
          .select('*')
          .eq('user_id', user.id)
          .eq('book_id', bookId)
          .order('created_at', { ascending: false });

        set({ highlights: data || [] });
      },

      // UI State
      isTocOpen: false,
      isSettingsOpen: false,
      isBookmarksOpen: false,
      isHighlightsOpen: false,

      setTocOpen: (open) => set({ isTocOpen: open }),
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
      setBookmarksOpen: (open) => set({ isBookmarksOpen: open }),
      setHighlightsOpen: (open) => set({ isHighlightsOpen: open }),
    }),
    {
      name: 'ultrabooks-reader-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
