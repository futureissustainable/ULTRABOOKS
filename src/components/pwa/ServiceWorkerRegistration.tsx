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
          setServiceWorkerReady(true);
          loadCachedBooks();

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available - could trigger update prompt
                }
              });
            }
          });
        })
        .catch(() => {
          // Service worker failed - app works without offline support
        });
    }
  }, [setServiceWorkerReady, loadCachedBooks]);

  return null;
}
