-- Add shared_books table for book sharing functionality
CREATE TABLE shared_books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  book_id UUID REFERENCES books ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  share_code TEXT UNIQUE NOT NULL,
  include_bookmarks BOOLEAN DEFAULT false,
  include_highlights BOOLEAN DEFAULT false,
  include_notes BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Index for share code lookups
CREATE INDEX shared_books_share_code_idx ON shared_books(share_code);
CREATE INDEX shared_books_user_book_idx ON shared_books(user_id, book_id);

-- Enable RLS
ALTER TABLE shared_books ENABLE ROW LEVEL SECURITY;

-- Users can manage their own shares
CREATE POLICY "Users can view own shares" ON shared_books FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shares" ON shared_books FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shares" ON shared_books FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shares" ON shared_books FOR DELETE USING (auth.uid() = user_id);

-- Public can view active shares (for the share page)
CREATE POLICY "Public can view active shares" ON shared_books FOR SELECT USING (is_active = true);
