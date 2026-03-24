'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, PiggyBank, RefreshCw, BarChart3, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Home' },
  { href: '/transactions', icon: Receipt, label: 'Txns' },
  { href: '/budgets', icon: PiggyBank, label: 'Budgets' },
  { href: '/recurring', icon: RefreshCw, label: 'Bills' },
  { href: '/savings', icon: Target, label: 'Goals' },
  { href: '/insights', icon: BarChart3, label: 'Insights' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors',
                active
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
