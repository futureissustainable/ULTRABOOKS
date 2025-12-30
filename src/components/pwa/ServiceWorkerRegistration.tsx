'use client';

import { useEffect } from 'react';
import { useOfflineStore } from '@/lib/stores/offline-store';

export function ServiceWorkerRegistration() {
  const { setServiceWorkerReady, loadCachedBooks } = useOfflineStore();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
          setServiceWorkerReady(true);
          loadCachedBooks();

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  console.log('New service worker available');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHED_BOOKS_LIST') {
          // Handle cached books list
          console.log('Cached books:', event.data.payload.urls);
        }
      });
    }
  }, [setServiceWorkerReady, loadCachedBooks]);

  return null;
}
