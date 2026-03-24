'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Target, X, DollarSign } from 'lucide-react';
import { useBudgetStore } from '@/store';
import { formatCurrency, cn } from '@/lib/utils';

export default function SavingsPage() {
  const { savingsGoals, addSavingsGoal, deleteSavingsGoal, contributeSavings, currency } = useBudgetStore();
  const [showForm, setShowForm] = useState(false);
  const [showContribute, setShowContribute] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [contributeAmount, setContributeAmount] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !targetAmount) return;
    addSavingsGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      deadline: deadline || undefined,
    });
    resetForm();
  }

  function handleContribute(goalId: string) {
    const amount = parseFloat(contributeAmount);
    if (isNaN(amount) || amount <= 0) return;
    contributeSavings(goalId, amount);
    setShowContribute(null);
    setContributeAmount('');
  }

  function resetForm() {
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    setShowForm(false);
  }

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Savings Goals</h2>
          <p className="text-sm text-stone-400 dark:text-stone-500">
            Saved: <span className="font-semibold text-emerald-500">{formatCurrency(totalSaved, currency)}</span>
            {totalTarget > 0 && (
              <span> of {formatCurrency(totalTarget, currency)}</span>
            )}
          </p>
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
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Goal name (e.g. Emergency Fund)"
              className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-sm border-0 outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
              required
            />
            <input
              type="number"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Target amount"
              className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-sm border-0 outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
              required
            />
            <input
              type="number"
              step="0.01"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              placeholder="Already saved (optional)"
              className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-sm border-0 outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-sm border-0 outline-none text-stone-800 dark:text-stone-100"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors"
            >
              Create Goal
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Goals list */}
      <div className="space-y-3">
        <AnimatePresence>
          {savingsGoals.length === 0 ? (
            <div className="text-center py-12">
              <Target size={40} className="mx-auto text-stone-300 dark:text-stone-600 mb-3" />
              <p className="text-sm text-stone-400">No savings goals yet</p>
              <p className="text-xs text-stone-400 mt-1">Set a target and start tracking your progress!</p>
            </div>
          ) : (
            savingsGoals.map((goal) => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const isComplete = progress >= 100;
              const remaining = goal.targetAmount - goal.currentAmount;

              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-100 flex items-center gap-2">
                        {goal.name}
                        {isComplete && <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">🎉 Done!</span>}
                      </p>
                      <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                        {formatCurrency(goal.currentAmount, currency)} of {formatCurrency(goal.targetAmount, currency)}
                        {goal.deadline && ` · Due ${new Date(goal.deadline).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setShowContribute(showContribute === goal.id ? null : goal.id);
                          setContributeAmount('');
                        }}
                        className={cn(
                          'p-1.5 rounded-lg text-xs font-medium transition-all',
                          isComplete
                            ? 'text-stone-300 cursor-default'
                            : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                        )}
                        disabled={isComplete}
                      >
                        <DollarSign size={14} />
                      </button>
                      <button
                        onClick={() => deleteSavingsGoal(goal.id)}
                        className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden mb-1">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{
                        backgroundColor: isComplete ? '#22c55e' : progress >= 50 ? '#3b82f6' : '#f59e0b',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>{Math.round(progress)}%</span>
                    {!isComplete && <span>{formatCurrency(remaining, currency)} remaining</span>}
                  </div>

                  {/* Contribute form */}
                  <AnimatePresence>
                    {showContribute === goal.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-2 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                          <input
                            type="number"
                            step="0.01"
                            value={contributeAmount}
                            onChange={(e) => setContributeAmount(e.target.value)}
                            placeholder="Amount to add"
                            className="flex-1 py-2 px-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-sm border-0 outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
                            autoFocus
                          />
                          <button
                            onClick={() => handleContribute(goal.id)}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
