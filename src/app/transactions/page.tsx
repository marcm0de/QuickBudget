'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useBudgetStore } from '@/store';
import { ALL_CATEGORIES, Category, CATEGORY_COLORS } from '@/lib/types';
import TransactionItem from '@/components/TransactionItem';
import AddTransactionModal from '@/components/AddTransactionModal';
import { cn } from '@/lib/utils';

type SortKey = 'date' | 'amount' | 'category';

export default function TransactionsPage() {
  const { transactions } = useBudgetStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('date');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    let txns = [...transactions];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      txns = txns.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      txns = txns.filter((t) => t.category === categoryFilter);
    }

    // Sort
    txns.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'amount') return b.amount - a.amount;
      return a.category.localeCompare(b.category);
    });

    return txns;
  }, [transactions, search, categoryFilter, sortBy]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Transactions</h2>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-900 rounded-xl text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 border-0 outline-none shadow-sm"
        />
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={14} className="text-stone-400" />
        <span className="text-xs text-stone-400">Sort:</span>
        {(['date', 'amount', 'category'] as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={cn(
              'text-xs px-2.5 py-1 rounded-lg transition-colors capitalize',
              sortBy === key
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium'
                : 'text-stone-400 hover:text-stone-600'
            )}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategoryFilter('all')}
          className={cn(
            'shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors font-medium',
            categoryFilter === 'all'
              ? 'bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
          )}
        >
          All
        </button>
        {ALL_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={cn(
              'shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors font-medium',
              categoryFilter === c
                ? 'text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
            )}
            style={categoryFilter === c ? { backgroundColor: CATEGORY_COLORS[c] } : {}}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Transaction list */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <p className="text-sm text-stone-400 py-8 text-center">No transactions found</p>
            ) : (
              filtered.map((t) => (
                <TransactionItem key={t.id} transaction={t} showDelete />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <Plus size={24} />
      </button>

      <AddTransactionModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
