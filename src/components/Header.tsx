'use client';

import { Moon, Sun, Download } from 'lucide-react';
import { useBudgetStore } from '@/store';
import { exportToCSV, downloadCSV } from '@/lib/utils';
import { Currency, CURRENCY_SYMBOLS } from '@/lib/types';

export default function Header() {
  const { darkMode, toggleDarkMode, currency, setCurrency, transactions } = useBudgetStore();

  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-700">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">
          Quick<span className="text-emerald-600 dark:text-emerald-400">Budget</span>
        </h1>
        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-lg px-2 py-1.5 border-0 outline-none cursor-pointer"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {CURRENCY_SYMBOLS[c]} {c}
              </option>
            ))}
          </select>
          <button
            onClick={() => downloadCSV(exportToCSV(transactions))}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
            title="Export CSV"
          >
            <Download size={18} />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
