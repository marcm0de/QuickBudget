'use client';

import { useMemo } from 'react';
import { useBudgetStore } from '@/store';
import { TrendLineChart } from '@/components/Charts';
import { formatCurrency, getMonthTransactions, getMonthlyIncome, getMonthlyExpenses, getCategorySpending } from '@/lib/utils';
import { CATEGORY_COLORS, Category } from '@/lib/types';
import { subMonths, format, parseISO, getDaysInMonth } from 'date-fns';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Trophy, RefreshCw, Target } from 'lucide-react';

export default function InsightsPage() {
  const { transactions, currency, recurringBills, savingsGoals } = useBudgetStore();

  const now = new Date();
  const currentMonth = getMonthTransactions(transactions, now);
  const lastMonth = getMonthTransactions(transactions, subMonths(now, 1));

  const currentExpenses = getMonthlyExpenses(transactions, now);
  const lastExpenses = getMonthlyExpenses(transactions, subMonths(now, 1));
  const currentIncome = getMonthlyIncome(transactions, now);
  const lastIncome = getMonthlyIncome(transactions, subMonths(now, 1));

  // Trend data for the last 6 months
  const trendData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      months.push({
        month: format(d, 'MMM'),
        income: getMonthlyIncome(transactions, d),
        expenses: getMonthlyExpenses(transactions, d),
      });
    }
    return months;
  }, [transactions]);

  // Top spending categories this month
  const categorySpending = useMemo(() => getCategorySpending(transactions, now), [transactions]);
  const topCategories = useMemo(
    () =>
      Object.entries(categorySpending)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
    [categorySpending]
  );

  // Average daily spend this month
  const daysElapsed = now.getDate();
  const avgDaily = daysElapsed > 0 ? currentExpenses / daysElapsed : 0;

  // Biggest expense this month
  const biggestExpense = useMemo(() => {
    const expenses = currentMonth.filter((t) => t.type === 'expense');
    if (expenses.length === 0) return null;
    return expenses.reduce((max, t) => (t.amount > max.amount ? t : max));
  }, [currentMonth]);

  // Month-over-month change
  const expenseChange = lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0;
  const incomeChange = lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Insights</h2>

      {/* Month-over-month comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown size={14} className="text-red-500" />
            <span className="text-xs text-stone-400">Expenses vs Last Month</span>
          </div>
          <p className="text-lg font-bold text-stone-800 dark:text-stone-100">
            {formatCurrency(currentExpenses, currency)}
          </p>
          <p className={`text-xs font-medium ${expenseChange > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            {expenseChange > 0 ? '↑' : '↓'} {Math.abs(expenseChange).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={14} className="text-emerald-500" />
            <span className="text-xs text-stone-400">Income vs Last Month</span>
          </div>
          <p className="text-lg font-bold text-stone-800 dark:text-stone-100">
            {formatCurrency(currentIncome, currency)}
          </p>
          <p className={`text-xs font-medium ${incomeChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {incomeChange >= 0 ? '↑' : '↓'} {Math.abs(incomeChange).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar size={14} className="text-blue-500" />
            <span className="text-xs text-stone-400">Avg Daily Spend</span>
          </div>
          <p className="text-lg font-bold text-stone-800 dark:text-stone-100">
            {formatCurrency(avgDaily, currency)}
          </p>
        </div>
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <Trophy size={14} className="text-yellow-500" />
            <span className="text-xs text-stone-400">Biggest Expense</span>
          </div>
          {biggestExpense ? (
            <>
              <p className="text-lg font-bold text-stone-800 dark:text-stone-100">
                {formatCurrency(biggestExpense.amount, currency)}
              </p>
              <p className="text-xs text-stone-400 truncate">{biggestExpense.description}</p>
            </>
          ) : (
            <p className="text-sm text-stone-400">—</p>
          )}
        </div>
      </div>

      {/* Spending trends */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-3">Income vs Expenses Trend</h3>
        <TrendLineChart data={trendData} />
      </div>

      {/* Recurring Bills Monthly Impact */}
      {recurringBills.length > 0 && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw size={14} className="text-orange-500" />
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200">Recurring Bills Impact</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs text-stone-400">Monthly Recurring</p>
              <p className="text-lg font-bold text-red-500">
                {formatCurrency(
                  recurringBills.reduce((sum, bill) => {
                    if (bill.frequency === 'weekly') return sum + bill.amount * 4.33;
                    if (bill.frequency === 'yearly') return sum + bill.amount / 12;
                    return sum + bill.amount;
                  }, 0),
                  currency
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400">% of Expenses</p>
              <p className="text-lg font-bold text-stone-800 dark:text-stone-100">
                {currentExpenses > 0
                  ? `${Math.round(
                      (recurringBills.reduce((sum, bill) => {
                        if (bill.frequency === 'weekly') return sum + bill.amount * 4.33;
                        if (bill.frequency === 'yearly') return sum + bill.amount / 12;
                        return sum + bill.amount;
                      }, 0) /
                        currentExpenses) *
                        100
                    )}%`
                  : '—'}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {recurringBills.slice(0, 5).map((bill) => (
              <div key={bill.id} className="flex items-center justify-between text-sm">
                <span className="text-stone-600 dark:text-stone-300">{bill.name}</span>
                <span className="text-stone-500 dark:text-stone-400 font-medium">
                  {formatCurrency(bill.amount, currency)}/{bill.frequency === 'monthly' ? 'mo' : bill.frequency === 'weekly' ? 'wk' : 'yr'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Savings Goals Progress */}
      {savingsGoals.length > 0 && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} className="text-emerald-500" />
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200">Savings Goals</h3>
          </div>
          <div className="space-y-3">
            {savingsGoals.map((goal) => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-stone-700 dark:text-stone-200">{goal.name}</span>
                    <span className="text-xs text-stone-400">
                      {formatCurrency(goal.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
                    </span>
                  </div>
                  <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: progress >= 100 ? '#22c55e' : '#3b82f6',
                      }}
                    />
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">{Math.round(progress)}% complete</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top spending categories */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-3">Top Spending Categories</h3>
        <div className="space-y-3">
          {topCategories.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-4">No spending data</p>
          ) : (
            topCategories.map(([cat, amount], i) => {
              const maxAmount = topCategories[0][1];
              const ratio = maxAmount > 0 ? amount / maxAmount : 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 w-4 text-right">{i + 1}</span>
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[cat as Category] || '#6b7280' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-stone-700 dark:text-stone-200">{cat}</span>
                      <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                        {formatCurrency(amount, currency)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${ratio * 100}%`,
                          backgroundColor: CATEGORY_COLORS[cat as Category] || '#6b7280',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
