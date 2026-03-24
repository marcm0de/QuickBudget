'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBudgetStore } from '@/store';
import { EXPENSE_CATEGORIES, Category, CATEGORY_COLORS } from '@/lib/types';
import { formatCurrency, getCategorySpending } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function BudgetsPage() {
  const { budgets, setBudget, removeBudget, transactions, currency } = useBudgetStore();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editLimit, setEditLimit] = useState('');

  const categorySpending = useMemo(() => getCategorySpending(transactions), [transactions]);

  function handleSave(category: Category) {
    const val = parseFloat(editLimit);
    if (val > 0) {
      setBudget(category, val);
    }
    setEditingCategory(null);
    setEditLimit('');
  }

  function getProgressColor(spent: number, limit: number): string {
    const ratio = spent / limit;
    if (ratio >= 1) return '#ef4444';
    if (ratio >= 0.75) return '#eab308';
    return '#22c55e';
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Budget Limits</h2>
      <p className="text-sm text-stone-400 dark:text-stone-500">Set monthly spending limits per category</p>

      <div className="space-y-3">
        {EXPENSE_CATEGORIES.map((category) => {
          const budget = budgets.find((b) => b.category === category);
          const spent = categorySpending[category] || 0;
          const limit = budget?.limit || 0;
          const ratio = limit > 0 ? Math.min(spent / limit, 1) : 0;
          const isEditing = editingCategory === category;

          return (
            <motion.div
              key={category}
              layout
              className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[category] }}
                  />
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-200">{category}</span>
                </div>
                <div className="flex items-center gap-2">
                  {budget && (
                    <span className="text-xs text-stone-400">
                      {formatCurrency(spent, currency)} / {formatCurrency(limit, currency)}
                    </span>
                  )}
                </div>
              </div>

              {budget && (
                <div className="mb-3">
                  <div className="h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ratio * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getProgressColor(spent, limit) }}
                    />
                  </div>
                  {spent > limit && (
                    <p className="text-xs text-red-500 mt-1">
                      Over budget by {formatCurrency(spent - limit, currency)}
                    </p>
                  )}
                </div>
              )}

              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editLimit}
                    onChange={(e) => setEditLimit(e.target.value)}
                    placeholder="Monthly limit"
                    className="flex-1 py-2 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-sm border-0 outline-none text-stone-800 dark:text-stone-100"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSave(category)}
                  />
                  <button
                    onClick={() => handleSave(category)}
                    className="px-3 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setEditingCategory(null); setEditLimit(''); }}
                    className="px-3 py-2 text-stone-400 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setEditLimit(budget?.limit?.toString() || '');
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                  >
                    {budget ? 'Edit Limit' : 'Set Limit'}
                  </button>
                  {budget && (
                    <button
                      onClick={() => removeBudget(category)}
                      className="text-xs px-3 py-1.5 text-red-400 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
