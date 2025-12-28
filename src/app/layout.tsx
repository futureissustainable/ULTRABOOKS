import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'ULTRABOOKS - Read Anywhere',
  description: 'A brutalist ebook reader for EPUB, PDF, and MOBI files. Sync your reading progress, bookmarks, and highlights across all devices.',
  keywords: ['ebook', 'reader', 'epub', 'pdf', 'mobi', 'reading', 'books'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
