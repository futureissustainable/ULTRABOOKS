'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Spinner } from '@/components/ui';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="font-ui text-sm uppercase tracking-wide animate-pulse-brutal">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
