'use client';

import { useState, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudgetStore } from '@/store';
import { formatCurrency, getMonthlyIncome, getMonthlyExpenses, getCategorySpending, getDailySpending, getMonthTransactions } from '@/lib/utils';
import { CATEGORY_COLORS, Category } from '@/lib/types';
import { SpendingPieChart, DailyBarChart } from '@/components/Charts';
import TransactionItem from '@/components/TransactionItem';
import AddTransactionModal from '@/components/AddTransactionModal';
import { format } from 'date-fns';

export default function Dashboard() {
  const { transactions, currency, budgets } = useBudgetStore();
  const [showAdd, setShowAdd] = useState(false);

  const now = new Date();
  const income = useMemo(() => getMonthlyIncome(transactions), [transactions]);
  const expenses = useMemo(() => getMonthlyExpenses(transactions), [transactions]);
  const net = income - expenses;

  const categorySpending = useMemo(() => getCategorySpending(transactions), [transactions]);
  const pieData = useMemo(
    () => Object.entries(categorySpending).map(([name, value]) => ({ name, value })),
    [categorySpending]
  );
  const dailyData = useMemo(() => getDailySpending(transactions), [transactions]);

  const recentTxns = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [transactions]
  );

  // Check for over-budget alerts
  const alerts = useMemo(() => {
    return budgets
      .filter((b) => {
        const spent = categorySpending[b.category] || 0;
        return spent > b.limit;
      })
      .map((b) => ({
        category: b.category,
        spent: categorySpending[b.category] || 0,
        limit: b.limit,
      }));
  }, [budgets, categorySpending]);

  return (
    <div className="space-y-4">
      {/* Month label */}
      <p className="text-sm text-stone-400 dark:text-stone-500 font-medium">
        {format(now, 'MMMM yyyy')}
      </p>

      {/* Over budget alerts */}
      <AnimatePresence>
        {alerts.map((a) => (
          <motion.div
            key={a.category}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3 text-sm text-red-600 dark:text-red-400"
          >
            ⚠️ <strong>{a.category}</strong> is over budget: {formatCurrency(a.spent, currency)} / {formatCurrency(a.limit, currency)}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={14} className="text-emerald-500" />
            <span className="text-xs text-stone-400 dark:text-stone-500">Income</span>
          </div>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(income, currency)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown size={14} className="text-red-500" />
            <span className="text-xs text-stone-400 dark:text-stone-500">Expenses</span>
          </div>
          <p className="text-lg font-bold text-red-500 dark:text-red-400">
            {formatCurrency(expenses, currency)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Wallet size={14} className="text-blue-500" />
            <span className="text-xs text-stone-400 dark:text-stone-500">Net</span>
          </div>
          <p className={`text-lg font-bold ${net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {net >= 0 ? '+' : ''}{formatCurrency(net, currency)}
          </p>
        </motion.div>
      </div>

      {/* Spending by category */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">Spending by Category</h3>
        <SpendingPieChart data={pieData} />
        <div className="flex flex-wrap gap-2 mt-3">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[d.name as Category] || '#6b7280' }}
              />
              {d.name}
            </div>
          ))}
        </div>
      </div>

      {/* Daily spending */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">Daily Spending</h3>
        <DailyBarChart data={dailyData} />
      </div>

      {/* Recent transactions */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">Recent Transactions</h3>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {recentTxns.length === 0 ? (
            <p className="text-sm text-stone-400 py-4 text-center">No transactions yet</p>
          ) : (
            recentTxns.map((t) => <TransactionItem key={t.id} transaction={t} />)
          )}
        </div>
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAdd(true)}
        className="fixed bottom-20 right-4 sm:right-auto sm:left-1/2 sm:translate-x-[180px] w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <Plus size={24} />
      </motion.button>

      <AddTransactionModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
