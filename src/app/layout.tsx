import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';
import './globals.css';

// Load custom fonts
const mondwest = localFont({
  src: '../../public/fonts/PPMondwest-Regular.otf',
  variable: '--font-mondwest',
  display: 'swap',
});

const neueBit = localFont({
  src: '../../public/fonts/PPNeueBit-Bold.otf',
  variable: '--font-neuebit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ultrabooks',
  description: 'A brutalist ebook reader for EPUB, PDF, and MOBI files. Sync your reading progress, bookmarks, and highlights across all devices.',
  keywords: ['ebook', 'reader', 'epub', 'pdf', 'mobi', 'reading', 'books'],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ultrabooks',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${mondwest.variable} ${neueBit.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ServiceWorkerRegistration />
            <OfflineIndicator />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
