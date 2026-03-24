'use client';

import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Transaction, CATEGORY_COLORS } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useBudgetStore } from '@/store';
import { format, parseISO } from 'date-fns';

interface Props {
  transaction: Transaction;
  showDelete?: boolean;
}

export default function TransactionItem({ transaction, showDelete = false }: Props) {
  const { deleteTransaction, currency } = useBudgetStore();
  const isIncome = transaction.type === 'income';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex items-center gap-3 py-3 group"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
        style={{ backgroundColor: CATEGORY_COLORS[transaction.category] }}
      >
        {transaction.category[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 dark:text-stone-100 truncate">
          {transaction.description}
        </p>
        <p className="text-xs text-stone-400 dark:text-stone-500">
          {transaction.category} · {format(parseISO(transaction.date), 'MMM d')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-semibold ${
            isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
          }`}
        >
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
        </span>
        {showDelete && (
          <button
            onClick={() => deleteTransaction(transaction.id)}
            className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
