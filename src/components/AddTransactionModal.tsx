'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useBudgetStore } from '@/store';
import {
  TransactionType,
  Category,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CATEGORY_COLORS,
} from '@/lib/types';
import { cn } from '@/lib/utils';

const QUICK_PRESETS = [
  { label: '☕ Coffee', amount: 5.50, category: 'Food' as Category, type: 'expense' as TransactionType },
  { label: '🍕 Lunch', amount: 15, category: 'Food' as Category, type: 'expense' as TransactionType },
  { label: '⛽ Gas', amount: 50, category: 'Transport' as Category, type: 'expense' as TransactionType },
  { label: '🛒 Groceries', amount: 60, category: 'Food' as Category, type: 'expense' as TransactionType },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ open, onClose }: Props) {
  const { addTransaction } = useBudgetStore();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    addTransaction({
      amount: parseFloat(amount),
      type,
      category,
      description: description || category,
      date: new Date(date).toISOString(),
    });
    resetAndClose();
  }

  function handlePreset(preset: typeof QUICK_PRESETS[number]) {
    addTransaction({
      amount: preset.amount,
      type: preset.type,
      category: preset.category,
      description: preset.label.replace(/^\S+\s/, ''),
      date: new Date().toISOString(),
    });
    resetAndClose();
  }

  function resetAndClose() {
    setAmount('');
    setDescription('');
    setType('expense');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-t-2xl sm:rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
            style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">Add Transaction</h2>
              <button onClick={resetAndClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Quick presets */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {QUICK_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type toggle */}
              <div className="flex gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setType('expense'); setCategory('Food'); }}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                    type === 'expense'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'text-stone-500 dark:text-stone-400'
                  )}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => { setType('income'); setCategory('Salary'); }}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                    type === 'income'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-stone-500 dark:text-stone-400'
                  )}
                >
                  Income
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 block">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-3xl font-bold text-center py-4 bg-stone-50 dark:bg-stone-800 rounded-xl border-2 border-transparent outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:border-stone-200 dark:focus:border-stone-700 transition-colors"
                  autoFocus
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                        category === c
                          ? 'text-white shadow-sm'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                      )}
                      style={category === c ? { backgroundColor: CATEGORY_COLORS[c] } : {}}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 block">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was this for?"
                  className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl border-2 border-transparent outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-400 text-sm focus:border-stone-200 dark:focus:border-stone-700 transition-colors"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl border-2 border-transparent outline-none text-stone-800 dark:text-stone-100 text-sm focus:border-stone-200 dark:focus:border-stone-700 transition-colors"
                />
              </div>

              <button
                type="submit"
                className={cn(
                  'w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98]',
                  type === 'expense'
                    ? 'bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20'
                )}
              >
                Add {type === 'expense' ? 'Expense' : 'Income'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
