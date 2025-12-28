import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Book } from '@/lib/supabase/types';

interface BookState {
  books: Book[];
  currentBook: Book | null;
  isLoading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  fetchBook: (id: string) => Promise<void>;
  uploadBook: (file: File) => Promise<{ book: Book | null; error: string | null }>;
  deleteBook: (id: string) => Promise<void>;
  updateBook: (id: string, data: Partial<Book>) => Promise<void>;
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  currentBook: null,
  isLoading: false,
  error: null,

  fetchBooks: async () => {
    const supabase = createClient();
    set({ isLoading: true, error: null });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ isLoading: false, error: 'Not authenticated' });
      return;
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }

    set({ books: data || [], isLoading: false });
  },

  fetchBook: async (id: string) => {
    const supabase = createClient();
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }

    set({ currentBook: data, isLoading: false });
  },

  uploadBook: async (file: File) => {
    const supabase = createClient();
    set({ isLoading: true, error: null });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ isLoading: false, error: 'Not authenticated' });
      return { book: null, error: 'Not authenticated' };
    }

    // Determine file type
    const fileName = file.name.toLowerCase();
    let fileType: 'epub' | 'pdf' | 'mobi';
    if (fileName.endsWith('.epub')) {
      fileType = 'epub';
    } else if (fileName.endsWith('.pdf')) {
      fileType = 'pdf';
    } else if (fileName.endsWith('.mobi')) {
      fileType = 'mobi';
    } else {
      set({ isLoading: false, error: 'Unsupported file type' });
      return { book: null, error: 'Unsupported file type. Please upload EPUB, PDF, or MOBI files.' };
    }

    // Upload file to storage
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('books')
      .upload(filePath, file);

    if (uploadError) {
      set({ isLoading: false, error: uploadError.message });
      return { book: null, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('books')
      .getPublicUrl(filePath);

    // Extract title from filename
    const title = file.name.replace(/\.(epub|pdf|mobi)$/i, '');

    // Create book record
    const { data: book, error: insertError } = await supabase
      .from('books')
      .insert({
        user_id: user.id,
        title,
        file_url: urlData.publicUrl,
        file_type: fileType,
        file_size: file.size,
      })
      .select()
      .single();

    if (insertError) {
      set({ isLoading: false, error: insertError.message });
      return { book: null, error: insertError.message };
    }

    set((state) => ({
      books: [book, ...state.books],
      isLoading: false,
    }));

    return { book, error: null };
  },

  deleteBook: async (id: string) => {
    const supabase = createClient();
    set({ isLoading: true, error: null });

    // Get the book first to delete the file
    const { data: book } = await supabase
      .from('books')
      .select('file_url')
      .eq('id', id)
      .single();

    if (book) {
      // Extract file path from URL and delete from storage
      const url = new URL(book.file_url);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/books\/(.+)/);
      if (pathMatch) {
        await supabase.storage.from('books').remove([pathMatch[1]]);
      }
    }

    // Delete book record (cascades to bookmarks, highlights, progress)
    const { error } = await supabase.from('books').delete().eq('id', id);

    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }

    set((state) => ({
      books: state.books.filter((b) => b.id !== id),
      isLoading: false,
    }));
  },

  updateBook: async (id: string, data: Partial<Book>) => {
    const supabase = createClient();

    const { error } = await supabase
      .from('books')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      set((state) => ({
        books: state.books.map((b) =>
          b.id === id ? { ...b, ...data } : b
        ),
        currentBook: state.currentBook?.id === id
          ? { ...state.currentBook, ...data }
          : state.currentBook,
      }));
    }
  },
}));
