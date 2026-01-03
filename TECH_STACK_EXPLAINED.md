# MEMOROS Tech Stack Explained (Beginner-Friendly Guide)

Welcome! This guide explains how this ebook reader app works. Since you know HTML, CSS, and some JavaScript, I'll build on that knowledge.

---

## Quick Overview

**What is this app?** An ebook reader that lets you:
- Upload and read EPUB, PDF, and MOBI files
- Sync your reading progress across devices
- Create bookmarks and highlights
- Share books with others
- Read offline (like a phone app)

---

## Part 1: The Technologies Used

### 1.1 Next.js (The Framework)

**What you know:** HTML files that the browser opens directly.

**What Next.js does:** It's a tool that takes your code and creates those HTML files automatically. It also adds "superpowers" like:

```
Regular website:           Next.js website:
┌──────────────┐           ┌──────────────┐
│  index.html  │           │  page.tsx    │  ← You write this
│  about.html  │    vs     │  page.tsx    │
│  contact.html│           │  page.tsx    │
└──────────────┘           └──────────────┘
                                  ↓
                           Next.js builds
                                  ↓
                           ┌──────────────┐
                           │  HTML + JS   │  ← Browser gets this
                           └──────────────┘
```

**Why use it?**
- Automatic page routing (folder = URL)
- Fast page loads
- Can run code on the server (more secure)

### 1.2 React (The UI Library)

**What you know:** Writing HTML like `<div class="card"><h1>Title</h1></div>`

**What React does:** Lets you create reusable "components" - think of them like custom HTML tags:

```jsx
// Instead of repeating HTML everywhere...
<div class="book-card">
  <img src="cover1.jpg">
  <h3>Book Title 1</h3>
</div>
<div class="book-card">
  <img src="cover2.jpg">
  <h3>Book Title 2</h3>
</div>

// React lets you create a reusable component:
function BookCard({ cover, title }) {
  return (
    <div className="book-card">
      <img src={cover} />
      <h3>{title}</h3>
    </div>
  );
}

// And use it like this:
<BookCard cover="cover1.jpg" title="Book Title 1" />
<BookCard cover="cover2.jpg" title="Book Title 2" />
```

**The `{ }` braces:** In React, curly braces mean "put JavaScript here". So `{title}` means "insert the value of the title variable".

### 1.3 TypeScript (JavaScript with Safety)

**What you know:** JavaScript variables can be anything:
```javascript
let name = "John";
name = 42;        // JavaScript allows this (can cause bugs!)
```

**What TypeScript does:** Adds "types" to catch errors before they happen:
```typescript
let name: string = "John";
name = 42;        // TypeScript shows ERROR - can't put number in string!
```

**The `.tsx` files:** That's TypeScript + React combined. When you see `.tsx`, it's a React component written in TypeScript.

### 1.4 Tailwind CSS (Styling)

**What you know:** Writing CSS in separate files:
```css
/* styles.css */
.button {
  background-color: blue;
  padding: 10px 20px;
  border-radius: 5px;
}
```

**What Tailwind does:** Lets you style directly in HTML using utility classes:
```html
<!-- Instead of creating custom CSS classes... -->
<button class="bg-blue-500 px-5 py-2 rounded">Click me</button>
```

Each class does ONE thing:
- `bg-blue-500` = background color blue
- `px-5` = padding left/right (x-axis)
- `py-2` = padding top/bottom (y-axis)
- `rounded` = border-radius

### 1.5 Supabase (The Database & Backend)

**What you know:** Websites need a place to store data.

**What Supabase provides:**
1. **Database** - Tables to store books, users, bookmarks, etc.
2. **Authentication** - Login/signup system
3. **File Storage** - Place to store uploaded book files
4. **Real-time sync** - Data updates across devices

Think of it as "Firebase but with a real SQL database".

```
┌─────────────────────────────────────────────────┐
│                   SUPABASE                       │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │  Database   │  │   Storage   │  │   Auth   │ │
│  │  (Tables)   │  │   (Files)   │  │ (Login)  │ │
│  │             │  │             │  │          │ │
│  │ - users     │  │ - books/    │  │ - signup │ │
│  │ - books     │  │ - covers/   │  │ - login  │ │
│  │ - bookmarks │  │             │  │ - logout │ │
│  │ - highlights│  │             │  │          │ │
│  └─────────────┘  └─────────────┘  └──────────┘ │
└─────────────────────────────────────────────────┘
```

### 1.6 Zustand (State Management)

**What you know:** Variables in JavaScript hold data.

**The problem:** In React, when data changes, the page needs to update. But what if multiple components need the same data?

```
Without Zustand:                With Zustand:

┌──────────┐                   ┌─────────────────┐
│  Header  │ ← needs user      │   Zustand Store │
└──────────┘   name            │   { user: ... } │
┌──────────┐                   └────────┬────────┘
│  Sidebar │ ← needs user              │
└──────────┘   name            ┌───────┴───────┐
┌──────────┐                   ↓       ↓       ↓
│  Profile │ ← needs user    Header Sidebar Profile
└──────────┘   name            (all connected!)

(passing data everywhere       (everyone reads from
is messy and error-prone)      one central place)
```

---

## Part 2: Project Structure (The Folders)

```
ultrabooks/
├── src/                    ← All source code lives here
│   ├── app/                ← PAGES (URLs)
│   ├── components/         ← REUSABLE PIECES
│   └── lib/                ← HELPER CODE
├── public/                 ← STATIC FILES (images, fonts)
├── supabase/               ← DATABASE SETUP
└── package.json            ← PROJECT DEPENDENCIES
```

### 2.1 The `src/app/` Folder (Pages)

Next.js uses **folder-based routing**. The folder structure = the URLs:

```
src/app/
├── page.tsx                    → yoursite.com/
├── (auth)/
│   ├── login/page.tsx          → yoursite.com/login
│   └── signup/page.tsx         → yoursite.com/signup
├── (main)/
│   ├── library/page.tsx        → yoursite.com/library
│   ├── reader/[id]/page.tsx    → yoursite.com/reader/abc123
│   └── settings/page.tsx       → yoursite.com/settings
└── share/[code]/page.tsx       → yoursite.com/share/xyz789
```

**Special naming:**
- `page.tsx` = The actual page content
- `layout.tsx` = Wrapper around pages (like a template)
- `[id]` = Dynamic route (the id changes based on which book)
- `(auth)` = Route group (just for organization, doesn't affect URL)

### 2.2 The `src/components/` Folder (Building Blocks)

These are reusable pieces used across multiple pages:

```
components/
├── reader/                 ← Book reading components
│   ├── BookReader.tsx      ← Main reader (chooses format)
│   ├── EpubReader.tsx      ← For EPUB files
│   ├── PdfReader.tsx       ← For PDF files
│   └── ReaderToolbar.tsx   ← The top bar in reader
│
├── library/                ← Book library components
│   ├── BookCard.tsx        ← Single book display
│   ├── BookGrid.tsx        ← Grid of books
│   └── BookUpload.tsx      ← Upload interface
│
├── ui/                     ← Generic UI components
│   ├── Button.tsx
│   ├── Modal.tsx
│   └── Input.tsx
│
└── layout/                 ← Site structure
    ├── Header.tsx
    └── Footer.tsx
```

### 2.3 The `src/lib/` Folder (Helper Code)

Code that isn't visual but does important work:

```
lib/
├── supabase/               ← Database connection
│   ├── client.ts           ← Browser-side connection
│   ├── server.ts           ← Server-side connection
│   └── types.ts            ← Data type definitions
│
├── stores/                 ← Zustand state stores
│   ├── auth-store.ts       ← User login state
│   ├── book-store.ts       ← Book library data
│   ├── reader-store.ts     ← Reading settings & progress
│   └── theme-store.ts      ← Dark/light mode
│
└── epub-utils.ts           ← EPUB file processing
```

---

## Part 3: How Data Flows (The Big Picture)

### 3.1 When You Open the App

```
1. Browser loads the app
         ↓
2. AuthProvider checks: "Is user logged in?"
         ↓
   ┌─────┴─────┐
   ↓           ↓
Not logged   Logged in
   ↓           ↓
Show login   Load their books
page         from database
```

**Code location:** `src/components/auth/AuthProvider.tsx`

### 3.2 When You Upload a Book

```
1. You select a file (EPUB/PDF)
         ↓
2. App reads the file metadata
   - For EPUB: Extract title, author, cover image
   - For PDF: Just get file name
         ↓
3. Check quota: "Can this user upload more?"
         ↓
4. Upload file to Supabase Storage
         ↓
5. Create record in database:
   {
     id: "abc123",
     title: "The Great Gatsby",
     author: "F. Scott Fitzgerald",
     file_url: "path/to/file.epub",
     cover_url: "path/to/cover.jpg"
   }
         ↓
6. Update the book list on screen
```

**Code location:** `src/lib/stores/book-store.ts` → `uploadBooks()` function

### 3.3 When You Read a Book

```
1. Click on a book in library
         ↓
2. App navigates to /reader/[book-id]
         ↓
3. BookReader looks at file type:
   - EPUB → Use EpubReader
   - PDF  → Use PdfReader
   - MOBI → Use EpubReader (same engine)
         ↓
4. Download book file from Supabase Storage
         ↓
5. Load last reading position from database
         ↓
6. Render the book content on screen
         ↓
7. As you read, save progress every few seconds:
   - Save to localStorage (instant, works offline)
   - Save to database (syncs across devices)
```

**Code locations:**
- `src/app/(main)/reader/[id]/page.tsx`
- `src/components/reader/BookReader.tsx`
- `src/lib/stores/reader-store.ts`

### 3.4 When You Create a Bookmark

```
1. Click "Add Bookmark" button
         ↓
2. Get current location in book:
   - EPUB: CFI (special format like "epubcfi(/6/4[chapter1]!/2/4)")
   - PDF: Page number
         ↓
3. Create bookmark record:
   {
     book_id: "abc123",
     location: "epubcfi(...)",
     title: "Chapter 5",
     note: "Important quote here"
   }
         ↓
4. Save to database
         ↓
5. Update bookmarks list on screen
```

**Code location:** `src/lib/stores/reader-store.ts` → `addBookmark()` function

---

## Part 4: Understanding the Code (Examples)

### 4.1 A Simple React Component

Let's look at a simplified BookCard component:

```tsx
// src/components/library/BookCard.tsx

// These are like "imports" in other languages
import { Book } from '@/lib/supabase/types';

// The "interface" defines what data this component needs
interface BookCardProps {
  book: Book;           // The book object
  onClick: () => void;  // Function to call when clicked
}

// The component itself - a function that returns HTML-like code (JSX)
export function BookCard({ book, onClick }: BookCardProps) {
  return (
    // className is like "class" in HTML (React uses className)
    <div
      className="bg-white rounded-lg shadow p-4 cursor-pointer"
      onClick={onClick}
    >
      {/* If book has a cover, show it */}
      {book.cover_url && (
        <img
          src={book.cover_url}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Book info */}
      <h3 className="font-bold mt-2">{book.title}</h3>
      <p className="text-gray-600">{book.author}</p>
    </div>
  );
}
```

**Key things to notice:**
- `{ book, onClick }` - These are "props" (properties) passed to the component
- `{book.title}` - Curly braces insert JavaScript values
- `{book.cover_url && (...)}` - Shows the image only IF cover_url exists
- `className` instead of `class` (React requirement)
- The Tailwind classes like `bg-white`, `rounded-lg`, `p-4`

### 4.2 A Zustand Store (State Management)

Here's a simplified version of the theme store:

```typescript
// src/lib/stores/theme-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define what data the store holds
interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Create the store
export const useThemeStore = create<ThemeState>()(
  // "persist" saves to localStorage automatically
  persist(
    (set) => ({
      // Initial value
      theme: 'system',

      // Function to change the theme
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage', // localStorage key
    }
  )
);
```

**How to use it in a component:**

```tsx
function ThemeToggle() {
  // Get current theme and the function to change it
  const { theme, setTheme } = useThemeStore();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current: {theme}
    </button>
  );
}
```

### 4.3 Fetching Data from Supabase

```typescript
// Simplified example from book-store.ts

import { supabase } from '@/lib/supabase/client';

async function fetchUserBooks() {
  // Query the database
  const { data, error } = await supabase
    .from('books')                    // Which table
    .select('*')                      // Get all columns
    .order('created_at', {            // Sort by date
      ascending: false
    });

  if (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }

  return data;  // Array of book objects
}
```

This is similar to SQL:
```sql
SELECT * FROM books ORDER BY created_at DESC;
```

---

## Part 5: The Database (Tables)

Think of the database like Excel spreadsheets. Here are the main "tables":

### 5.1 Users Table (profiles)
| id | email | display_name | created_at |
|----|-------|--------------|------------|
| abc123 | john@email.com | John | 2024-01-15 |

### 5.2 Books Table
| id | user_id | title | author | file_url | cover_url |
|----|---------|-------|--------|----------|-----------|
| book1 | abc123 | The Great Gatsby | F. Scott Fitzgerald | /books/abc123/file.epub | /covers/book1.jpg |

### 5.3 Reading Progress Table
| id | user_id | book_id | current_page | progress_percentage | last_read_at |
|----|---------|---------|--------------|---------------------|--------------|
| prog1 | abc123 | book1 | 45 | 23.5 | 2024-01-20 |

### 5.4 Bookmarks Table
| id | user_id | book_id | location | title | note |
|----|---------|---------|----------|-------|------|
| bm1 | abc123 | book1 | epubcfi(/6/4...) | Chapter 3 | Remember this! |

---

## Part 6: How Pages Connect to Everything

Here's the full picture of a page:

```
┌─────────────────────────────────────────────────────────────┐
│                     Library Page                             │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 1. PAGE COMPONENT (src/app/(main)/library/page.tsx)     │ │
│  │    - Renders the page layout                            │ │
│  │    - Uses components from /components                   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 2. COMPONENTS                                           │ │
│  │    - BookGrid: Displays books in a grid                 │ │
│  │    - BookCard: Individual book display                  │ │
│  │    - BookUpload: Upload button & modal                  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 3. ZUSTAND STORES                                       │ │
│  │    - book-store: Provides books data                    │ │
│  │    - auth-store: Provides user info                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 4. SUPABASE                                             │ │
│  │    - Database: books, profiles tables                   │ │
│  │    - Storage: Book files and covers                     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 7: Key Concepts Explained Simply

### 7.1 What is "State"?

State is data that can change and affects what you see.

```
NOT State:              IS State:
- Your email address    - Which page you're on
- The app logo          - Is the menu open?
- Button labels         - Which book are you reading?
                        - Dark mode on/off?
```

When state changes, React updates the screen automatically.

### 7.2 What is a "Hook"?

Hooks are special React functions that start with `use`:

```tsx
// Built-in hooks:
const [count, setCount] = useState(0);     // Store data
const buttonRef = useRef(null);            // Reference DOM element

// Custom hooks (from this app):
const { user } = useAuthStore();           // Get user from auth store
const { books } = useBookStore();          // Get books from book store
```

### 7.3 What is "async/await"?

When your code needs to wait for something (like fetching from database):

```typescript
// Without async/await (harder to read):
fetchBooks().then(books => {
  console.log(books);
}).catch(error => {
  console.error(error);
});

// With async/await (easier to read):
async function loadBooks() {
  try {
    const books = await fetchBooks();  // Wait here until done
    console.log(books);
  } catch (error) {
    console.error(error);
  }
}
```

### 7.4 What are "Props"?

Props are how you pass data to components:

```tsx
// Parent component passes props:
<BookCard
  title="The Great Gatsby"
  author="F. Scott Fitzgerald"
  onClick={handleClick}
/>

// Child component receives props:
function BookCard({ title, author, onClick }) {
  return (
    <div onClick={onClick}>
      <h3>{title}</h3>
      <p>{author}</p>
    </div>
  );
}
```

---

## Part 8: File-by-File Guide (Important Files)

### 8.1 Entry Point: `src/app/layout.tsx`
- Wraps the entire app
- Sets up providers (auth, theme)
- Includes global CSS

### 8.2 Landing Page: `src/app/page.tsx`
- The homepage at yoursite.com/
- Shows features, hero section
- Has login/signup buttons

### 8.3 Library Page: `src/app/(main)/library/page.tsx`
- Shows all your uploaded books
- Uses BookGrid and BookCard components
- Has upload functionality

### 8.4 Reader Page: `src/app/(main)/reader/[id]/page.tsx`
- Displays the book reader
- Uses BookReader component
- Handles loading book data

### 8.5 Auth Store: `src/lib/stores/auth-store.ts`
- Manages login/logout
- Stores user information
- Handles signup

### 8.6 Book Store: `src/lib/stores/book-store.ts`
- Manages book library
- Handles uploads
- Handles deletions

### 8.7 Reader Store: `src/lib/stores/reader-store.ts`
- Reading settings (font, size, theme)
- Progress tracking
- Bookmarks and highlights

---

## Part 9: Running the App Locally

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
#    Create a .env.local file with:
#    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

---

## Part 10: Learning Path Suggestion

If you want to understand this codebase deeply, learn in this order:

1. **React Basics** - Components, props, state, hooks
2. **TypeScript Basics** - Types, interfaces
3. **Next.js App Router** - Pages, layouts, routing
4. **Tailwind CSS** - Utility classes
5. **Zustand** - State management
6. **Supabase** - Database, auth, storage

**Free Resources:**
- React: react.dev/learn
- Next.js: nextjs.org/docs
- TypeScript: typescriptlang.org/docs
- Tailwind: tailwindcss.com/docs
- Supabase: supabase.com/docs

---

## Quick Reference: File Extensions

| Extension | What it is |
|-----------|------------|
| `.tsx` | TypeScript + React (components with UI) |
| `.ts` | TypeScript only (logic, no UI) |
| `.css` | Stylesheet |
| `.json` | Data/configuration file |
| `.sql` | Database commands |
| `.md` | Documentation (like this file!) |

---

## Quick Reference: Common Patterns in This Codebase

```tsx
// 1. Getting data from a store
const { books, fetchBooks } = useBookStore();

// 2. Effect that runs on page load
useEffect(() => {
  fetchBooks();
}, []);

// 3. Conditional rendering
{isLoading ? <Spinner /> : <BookGrid books={books} />}

// 4. Mapping over arrays
{books.map(book => (
  <BookCard key={book.id} book={book} />
))}

// 5. Event handlers
const handleClick = () => {
  console.log('Clicked!');
};
<button onClick={handleClick}>Click me</button>

// 6. Async data fetching
const loadData = async () => {
  setLoading(true);
  const data = await fetchFromDatabase();
  setBooks(data);
  setLoading(false);
};
```

---

---

## Part 11: How The Code Actually Works (Line by Line)

Now let's look at REAL code from this app and understand every line.

---

### 11.1 The Library Page (`src/app/(main)/library/page.tsx`)

This is the simplest file - the page that shows your book library:

```tsx
'use client';
```
**Line 1:** This tells Next.js "this code runs in the browser, not on the server". You need this when using React features like `useState` or `useEffect`.

```tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LibraryGrid } from '@/components/library/LibraryGrid';
```
**Lines 3-5:** Import components we'll use. The `@/` is a shortcut for `src/` folder.

```tsx
export default function LibraryPage() {
```
**Line 7:** Create the page component. `export default` means "this is the main thing this file provides".

```tsx
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header />
      <main className="flex-1">
        <div className="container-page pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-24 md:pb-32">
          <LibraryGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}
```
**Lines 8-21:** Return the HTML structure:
- `min-h-screen` = minimum height is full screen
- `flex flex-col` = stack children vertically
- `bg-[var(--bg-primary)]` = use a CSS variable for background color
- `pt-16 sm:pt-24` = padding-top 16 on mobile, 24 on small screens (responsive)
- `<LibraryGrid />` = the component that shows all your books

**Key insight:** This page is just a layout wrapper. The real work happens in `LibraryGrid`.

---

### 11.2 The LibraryGrid Component (Where Books Are Displayed)

Let's break down `src/components/library/LibraryGrid.tsx`:

```tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
```
**Lines 1-3:** Import React hooks we'll use:
- `useEffect` = run code when component loads or when data changes
- `useState` = store data that can change (like search query)
- `useCallback` = optimize functions so they don't recreate unnecessarily

```tsx
import { useBookStore } from '@/lib/stores/book-store';
```
**Line 5:** Import the Zustand store that holds all book data.

```tsx
export function LibraryGrid() {
  const {
    books,           // Array of all user's books
    fetchBooks,      // Function to load books from database
    isLoading,       // true while loading
    hasFetched,      // true after first load attempt
    error,           // Error message if something failed
    uploadBook,      // Function to upload a single book
  } = useBookStore();
```
**Lines 19-27:** Get data and functions from the store. This is like "connecting" to the central data source.

```tsx
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
```
**Lines 24-25:** Create local state:
- `searchQuery` starts as empty string `''`
- `setSearchQuery` is the function to change it
- `isDragging` tracks if user is dragging a file over the page

```tsx
  useEffect(() => {
    if (!hasFetched) {
      fetchBooks();
      fetchQuota();
    }
    checkAndUpdateStreak();
  }, [fetchBooks, fetchQuota, hasFetched, checkAndUpdateStreak]);
```
**Lines 35-41:** This runs when the component first appears:
- `if (!hasFetched)` = only fetch if we haven't already
- `fetchBooks()` = load books from database
- The `[...]` at the end lists "dependencies" - the effect re-runs if these change

```tsx
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );
```
**Lines 43-47:** Filter books based on search:
- `.filter()` creates a new array with only matching items
- `.toLowerCase()` makes search case-insensitive
- `.includes()` checks if the search text appears anywhere in title/author
- `book.author?.` = the `?` handles cases where author might be `null`

```tsx
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();        // Stop browser from opening the file
    e.stopPropagation();       // Stop event from bubbling up
    setIsDragging(false);      // Hide the drag overlay

    const files = Array.from(e.dataTransfer.files);  // Get dropped files
    const validFiles = files.filter(file => validateFile(file));

    if (validFiles.length === 1) {
      await uploadBook(validFiles[0]);   // Upload single file
    } else {
      await uploadBooks(validFiles);     // Upload multiple files
    }
  }, [uploadBook, uploadBooks]);
```
**Lines 115-139:** Handle file drop:
- `async` = this function uses `await` for async operations
- `e.dataTransfer.files` = the files the user dropped
- `Array.from()` = convert the file list to a regular array
- `await uploadBook()` = wait for upload to complete before continuing

```tsx
  if (isLoading && !hasFetched) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }
```
**Lines 159-165:** Show a loading spinner while books are loading. This is called "conditional rendering" - we show different things based on state.

```tsx
  {sortedBooks.map((book) => (
    <BookCard
      key={book.id}
      book={book}
      isSelectionMode={isSelectionMode}
      isSelected={selectedBooks.has(book.id)}
      onSelect={handleToggleSelect}
    />
  ))}
```
**Lines 380-388:** Render each book as a card:
- `.map()` = loop through array and create something for each item
- `key={book.id}` = React needs unique keys to track items efficiently
- We pass the book data and callbacks as props

---

### 11.3 The BookCard Component (Single Book Display)

From `src/components/library/BookCard.tsx`:

```tsx
interface BookCardProps {
  book: Book;                        // The book object
  isSelectionMode?: boolean;         // Are we selecting books?
  isSelected?: boolean;              // Is THIS book selected?
  onSelect?: (book: Book) => void;   // Function to call when selected
}
```
**Lines 14-19:** TypeScript interface defining what props this component accepts:
- `book: Book` = required, must be a Book object
- `isSelectionMode?: boolean` = optional (`?`), defaults to undefined

```tsx
export function BookCard({ book, isSelectionMode, isSelected, onSelect }: BookCardProps) {
  const { deleteBook, isLoading } = useBookStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
```
**Lines 21-24:** Component setup:
- Destructure props: `{ book, ... }` pulls values out of the props object
- Get `deleteBook` function from the store
- Create local state for modal visibility

```tsx
  const coverUrl = getCoverUrl(book.cover_url);
```
**Line 26:** Convert the stored path to a full URL. The function handles edge cases like missing covers.

```tsx
  const handleDelete = async () => {
    await deleteBook(book.id);    // Delete from database
    setShowDeleteConfirm(false);  // Close the modal
  };
```
**Lines 35-38:** Delete handler:
- `async/await` = wait for delete to complete
- Then close the confirmation modal

```tsx
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
```
**Lines 40-44:** Helper function to show file sizes nicely:
- Template literals: `` `${variable} text` `` inserts variables into strings
- `.toFixed(1)` = show 1 decimal place

```tsx
  {coverUrl ? (
    <Image
      src={coverUrl}
      alt={book.title}
      fill
      className="object-cover"
    />
  ) : (
    <div className="flex flex-col items-center gap-3 p-6">
      <PixelIcon name="book" size={24} />
    </div>
  )}
```
**Lines 48-64:** Conditional rendering:
- `condition ? ifTrue : ifFalse` = ternary operator
- If `coverUrl` exists, show the image
- Otherwise, show a placeholder icon

```tsx
  <Link href={`/reader/${book.id}`}>
    {coverContent}
  </Link>
```
**Lines 98-100:** Clicking the card goes to the reader page:
- `Link` is Next.js's navigation component (like `<a>` but faster)
- `` `/reader/${book.id}` `` = dynamic URL with the book's ID

---

### 11.4 The BookReader Component (Choosing the Right Reader)

From `src/components/reader/BookReader.tsx`:

```tsx
export function BookReader({ book }: BookReaderProps) {
  switch (book.file_type) {
    case 'epub':
    case 'mobi':
      return <EpubReader book={book} />;
    case 'pdf':
      return <PdfReader book={book} />;
    default:
      return (
        <div>Unsupported Format</div>
      );
  }
}
```
**Lines 12-37:** This is a "router" component:
- `switch` checks the file type
- EPUB and MOBI both use `EpubReader` (same library handles both)
- PDF uses `PdfReader`
- Unknown types show an error message

---

### 11.5 The Book Store (Data Management)

From `src/lib/stores/book-store.ts` - this is the heart of the app:

```tsx
import { create } from 'zustand';
```
**Line 1:** Import Zustand's `create` function to make a store.

```tsx
interface BookState {
  books: Book[];              // Array of books
  currentBook: Book | null;   // Currently viewing book (or null)
  isLoading: boolean;         // Loading state
  error: string | null;       // Error message (or null)

  fetchBooks: () => Promise<void>;   // Function type that returns a Promise
  uploadBook: (file: File) => Promise<{ book: Book | null; error: string | null }>;
}
```
**Lines 40-62:** TypeScript interface defining the store's shape:
- State values: `books`, `currentBook`, `isLoading`, etc.
- Functions: `fetchBooks`, `uploadBook`, etc.
- `Promise<void>` = async function that doesn't return anything
- `Promise<{ book: Book | null; error: string | null }>` = returns an object

```tsx
export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  currentBook: null,
  isLoading: false,
  error: null,
```
**Lines 64-68:** Create the store with initial values:
- `create<BookState>` = create a store matching our interface
- `set` = function to update state
- `get` = function to read current state
- Initial values: empty array, null, false, etc.

```tsx
  fetchBooks: async () => {
    set({ isLoading: true, error: null });
```
**Lines 77-84:** Start of `fetchBooks`:
- `async () => {}` = async arrow function
- `set({ isLoading: true })` = update state to show we're loading

```tsx
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ isLoading: false, books: [] });
        return;
      }
```
**Lines 86-93:** Get current user:
- `try { }` = error handling block
- `createClient()` = get Supabase connection
- `const { data: { user } }` = destructure nested object
- If no user, stop loading and return empty

```tsx
      const { data, error } = await supabase
        .from('books')           // Which table
        .select('*')             // Get all columns
        .eq('user_id', user.id)  // Filter by user
        .order('updated_at', { ascending: false });  // Sort newest first
```
**Lines 95-99:** Database query:
- This is like SQL: `SELECT * FROM books WHERE user_id = ? ORDER BY updated_at DESC`
- Supabase uses a chainable API (each method returns an object with more methods)

```tsx
      if (error) {
        set({ isLoading: false, error: error.message });
        return;
      }

      set({ books: data || [], isLoading: false });
```
**Lines 101-106:** Handle response:
- If error, save the error message
- Otherwise, save the books (`data || []` means "use data, or empty array if null")

```tsx
    } catch (err) {
      console.error('fetchBooks error:', err);
      set({ isLoading: false, error: 'Failed to fetch books' });
    }
  },
```
**Lines 107-110:** Catch any unexpected errors.

---

### 11.6 Uploading a Book (Complex Flow)

```tsx
  uploadBook: async (file: File) => {
    const supabase = createClient();
    set({ isUploading: true, error: null });
```
**Lines 181-183:** Start upload process.

```tsx
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
      set({ isUploading: false, error: 'Unsupported file type' });
      return { book: null, error: 'Unsupported file type' };
    }
```
**Lines 199-211:** Validate file type:
- Check the file extension
- Reject if not epub/pdf/mobi

```tsx
    // For EPUBs, try to extract metadata
    if (fileType === 'epub') {
      try {
        const metadata = await extractEpubMetadata(file);
        if (metadata.title) {
          title = metadata.title;
        }
        if (metadata.author) {
          author = metadata.author;
        }
      } catch (epubError) {
        console.error('Error extracting EPUB metadata:', epubError);
      }
    }
```
**Lines 219-231:** Extract book info from EPUB:
- EPUBs contain metadata (title, author)
- We try to extract it, but continue even if it fails

```tsx
    // Upload file to storage
    const fileId = generateFileId();    // Create unique ID
    const filePath = `${user.id}/${fileId}.${fileType}`;
    const { error: uploadError } = await supabase.storage
      .from('books')
      .upload(filePath, file);
```
**Lines 299-304:** Upload the actual file:
- Generate a unique ID (UUID)
- Create path: `userId/uniqueId.epub`
- Upload to Supabase storage

```tsx
    // Create book record in database
    const { data: book, error: insertError } = await supabase
      .from('books')
      .insert({
        user_id: user.id,
        title,
        author,
        cover_url: coverUrl,
        file_url: filePath,
        file_type: fileType,
        file_size: file.size,
      })
      .select()
      .single();
```
**Lines 336-348:** Save book info to database:
- `.insert({...})` = add new row
- `.select()` = return the created row
- `.single()` = expect exactly one result

```tsx
    set((state) => ({
      books: [book, ...state.books],   // Add new book to START of array
      isUploading: false,
    }));

    return { book, error: null };
```
**Lines 364-369:** Update state:
- `set((state) => ({...}))` = update based on current state
- `[book, ...state.books]` = spread operator, puts new book first
- Return success

---

### 11.7 The Reader Store (Settings & Progress)

From `src/lib/stores/reader-store.ts`:

```tsx
export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      // ...
    }),
    {
      name: 'memoros-reader-settings',   // localStorage key
      partialize: (state) => ({          // What to save
        settings: state.settings,
        localProgress: state.localProgress,
      }),
    }
  )
);
```
**Lines 91-455:** This store uses `persist` middleware:
- `persist(...)` wraps the store to auto-save to localStorage
- `name` = the key in localStorage
- `partialize` = only save certain parts (not everything)

```tsx
  updateProgress: async (bookId, location, page, percentage) => {
    const now = new Date().toISOString();

    // Always save locally first (works offline)
    set((state) => ({
      currentLocation: location,
      currentPage: page || null,
      progressPercentage: percentage || 0,
      localProgress: {
        ...state.localProgress,
        [bookId]: {
          currentLocation: location,
          currentPage: page || null,
          progressPercentage: percentage || 0,
          lastReadAt: now,
        },
      },
    }));

    // Then try to sync to database
    try {
      const supabase = createClient();
      await supabase
        .from('reading_progress')
        .upsert({...});
    } catch (error) {
      // Silently fail - local progress is saved
    }
  },
```
**Lines 182-222:** Progress saving strategy:
1. Save to localStorage immediately (instant, works offline)
2. Try to sync to database (for cross-device sync)
3. If database fails, that's okay - local is saved

```tsx
  loadProgress: async (bookId) => {
    // First check local
    const localData = get().localProgress[bookId];

    // Then try database
    const { data } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('book_id', bookId)
      .single();

    // Compare timestamps - use newer one
    const serverTime = new Date(data.last_read_at).getTime();
    const localTime = new Date(localData.lastReadAt).getTime();

    if (serverTime >= localTime) {
      // Server is newer - use it
      set({ currentLocation: data.current_location });
    }
  },
```
**Lines 224-286:** Progress loading - picks the newest:
- Check local storage first
- Then check database
- Compare timestamps
- Use whichever is more recent

---

### 11.8 Supabase Client (Database Connection)

From `src/lib/supabase/client.ts`:

```tsx
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```
**Lines 4-5:** Read environment variables:
- `process.env` = Node.js environment variables
- `NEXT_PUBLIC_` prefix = available in browser (not secret)

```tsx
export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured...');
  }

  return createBrowserClient<Database>(
    supabaseUrl!,
    supabaseAnonKey!
  );
}
```
**Lines 11-20:** Create database client:
- Check if configured
- `<Database>` = TypeScript type for type-safe queries
- `!` = "trust me, this value exists" (we checked above)

---

## Part 12: Key Patterns to Recognize

### Pattern 1: The Loading Pattern
```tsx
if (isLoading) return <Spinner />;
return <ActualContent />;
```

### Pattern 2: The Try-Catch Pattern
```tsx
try {
  const result = await riskyOperation();
  handleSuccess(result);
} catch (error) {
  handleError(error);
}
```

### Pattern 3: The Conditional Render Pattern
```tsx
{condition && <ComponentToShow />}        // Show if true
{condition ? <IfTrue /> : <IfFalse />}   // Show one or the other
```

### Pattern 4: The Map Pattern
```tsx
{items.map(item => (
  <Component key={item.id} data={item} />
))}
```

### Pattern 5: The Store Pattern
```tsx
// In store: define state and functions
const useStore = create((set) => ({
  data: [],
  setData: (newData) => set({ data: newData }),
}));

// In component: use the store
const { data, setData } = useStore();
```

---

That's the complete code walkthrough! The best way to learn is to:
1. Find a small feature you want to understand
2. Start at the page component
3. Follow the imports down to see what each piece does
4. Read the store to understand data flow

Happy learning!
