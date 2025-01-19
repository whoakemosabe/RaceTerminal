'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useServerInsertedHTML } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  useServerInsertedHTML(() => {
    return (
      <>
        <style>{`
          body {
            min-height: 100vh;
            background: #000000;
          }
        `}</style>
      </>
    );
  });

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <div className={cn("min-h-screen bg-background text-foreground")}>
          {children}
        </div>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}