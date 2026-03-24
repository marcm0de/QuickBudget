'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useBudgetStore } from '@/store';

export default function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { darkMode, seedData, seeded } = useBudgetStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !seeded) {
      seedData();
    }
  }, [mounted, seeded, seedData]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-pulse text-stone-400 text-lg">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
