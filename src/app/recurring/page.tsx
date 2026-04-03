'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useBudgetStore } from '@/store';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, Category, Frequency, TransactionType, CATEGORY_COLORS } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';
import { format, parseISO, differenceInDays } from 'date-fns';

export default function RecurringPage() {
  const { recurringBills, addRecurringBill, deleteRecurringBill, currency } = useBudgetStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [category, setCategory] = useState<Category>('Bills');
  const [nextDue, setNextDue] = useState(new Date().toISOString().split('T')[0]);
  const [billType, setBillType] = useState<TransactionType>('expense');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !amount) return;
    addRecurringBill({
      name,
      amount: parseFloat(amount),
      frequency,
      category,
      nextDue,
      type: billType,
    });
    resetForm();
  }

  function resetForm() {
    setName('');
    setAmount('');
    setFrequency('monthly');
    setCategory('Bills');
    setBillType('expense');
    setNextDue(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  }

  const expenseBills = recurringBills.filter(b => b.type !== 'income');
  const incomeBills = recurringBills.filter(b => b.type === 'income');

  const monthlyTotal = expenseBills.reduce((sum, bill) => {
    if (bill.frequency === 'weekly') return sum + bill.amount * 4.33;
    if (bill.frequency === 'yearly') return sum + bill.amount / 12;
    return sum + bill.amount;
  }, 0);

  const monthlyIncomeTotal = incomeBills.reduce((sum, bill) => {
    if (bill.frequency === 'weekly') return sum + bill.amount * 4.33;
    if (bill.frequency === 'yearly') return sum + bill.amount / 12;
    return sum + bill.amount;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Recurring</h2>
          <div className="flex gap-3 text-sm text-stone-400 dark:text-stone-500">
            <span>Bills: <span className="font-semibold text-red-500">{formatCurrency(monthlyTotal, currency)}</span>/mo</span>
            {monthlyIncomeTotal > 0 && (
              <span>Income: <span className="font-semibold text-emerald-500">{formatCurrency(monthlyIncomeTotal, currency)}</span>/mo</span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm space-y-3 overflow-hidden"
          >
            {/* Type toggle */}
            <div className="flex gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <button
                type="button"
                onClick={() => { setBillType('expense'); setCategory('Bills'); }}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5',
                  billType === 'expense'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-stone-500 dark:text-stone-400'
                )}
              >
                <TrendingDown size={14} /> Expense
              </button>
              <button
                type="button"
                onClick={() => { setBillType('income'); setCategory('Salary'); }}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5',
                  billType === 'income'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-stone-500 dark:text-stone-400'
                )}
              >
                <TrendingUp size={14} /> Income
              </button>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={billType === 'income' ? 'Income name (e.g. Salary)' : 'Bill name (e.g. Netflix)'}
              className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-sm border-0 outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
              required
            />
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-sm border-0 outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
              required
            />
            <div className="flex gap-2">
              {(['weekly', 'monthly', 'yearly'] as Frequency[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-xs font-medium transition-colors capitalize',
                    frequency === f
                      ? 'bg-emerald-500 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-sm border-0 outline-none text-stone-800 dark:text-stone-100"
            >
              {(billType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="date"
              value={nextDue}
              onChange={(e) => setNextDue(e.target.value)}
              className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-sm border-0 outline-none text-stone-800 dark:text-stone-100"
            />
            <button
              type="submit"
              className={cn(
                'w-full py-2.5 text-white rounded-xl text-sm font-semibold transition-colors',
                billType === 'income' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
              )}
            >
              Add Recurring {billType === 'income' ? 'Income' : 'Bill'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Bills list */}
      <div className="space-y-3">
        <AnimatePresence>
          {recurringBills.length === 0 ? (
            <p className="text-sm text-stone-400 py-8 text-center">No recurring bills yet</p>
          ) : (
            recurringBills.map((bill) => {
              const daysUntilDue = differenceInDays(new Date(bill.nextDue), new Date());
              const isOverdue = daysUntilDue < 0;
              const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

              return (
                <motion.div
                  key={bill.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: CATEGORY_COLORS[bill.category] }}
                      >
                        {bill.category[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{bill.name}</p>
                        <p className="text-xs text-stone-400 dark:text-stone-500 capitalize">
                          {bill.frequency} · {bill.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={cn(
                          'text-sm font-semibold',
                          bill.type === 'income' ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                        )}>
                          {bill.type === 'income' ? '+' : '-'}{formatCurrency(bill.amount, currency)}
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar size={10} />
                          <span
                            className={cn(
                              isOverdue ? 'text-red-500' : isDueSoon ? 'text-yellow-500' : 'text-stone-400'
                            )}
                          >
                            {isOverdue
                              ? `${Math.abs(daysUntilDue)}d overdue`
                              : daysUntilDue === 0
                              ? 'Due today'
                              : `${daysUntilDue}d left`}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteRecurringBill(bill.id)}
                        className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
