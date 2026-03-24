'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget, RecurringBill, Currency, Category, QuickPreset } from '@/lib/types';
import { generateSeedTransactions, generateSeedRecurringBills } from '@/lib/seed';

interface BudgetStore {
  transactions: Transaction[];
  budgets: Budget[];
  recurringBills: RecurringBill[];
  currency: Currency;
  darkMode: boolean;
  seeded: boolean;

  // Transaction actions
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  // Budget actions
  setBudget: (category: Category, limit: number) => void;
  removeBudget: (category: Category) => void;

  // Recurring bill actions
  addRecurringBill: (bill: Omit<RecurringBill, 'id'>) => void;
  deleteRecurringBill: (id: string) => void;
  updateRecurringBill: (id: string, bill: Partial<RecurringBill>) => void;

  // Settings
  setCurrency: (c: Currency) => void;
  toggleDarkMode: () => void;

  // Seed
  seedData: () => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: [],
      recurringBills: [],
      currency: 'USD',
      darkMode: false,
      seeded: false,

      addTransaction: (t) =>
        set((state) => ({
          transactions: [
            { ...t, id: Math.random().toString(36).slice(2, 11) },
            ...state.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setBudget: (category, limit) =>
        set((state) => {
          const existing = state.budgets.findIndex((b) => b.category === category);
          const budgets = [...state.budgets];
          if (existing >= 0) {
            budgets[existing] = { category, limit, period: 'monthly' };
          } else {
            budgets.push({ category, limit, period: 'monthly' });
          }
          return { budgets };
        }),

      removeBudget: (category) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.category !== category),
        })),

      addRecurringBill: (bill) =>
        set((state) => ({
          recurringBills: [
            { ...bill, id: Math.random().toString(36).slice(2, 11) },
            ...state.recurringBills,
          ],
        })),

      deleteRecurringBill: (id) =>
        set((state) => ({
          recurringBills: state.recurringBills.filter((b) => b.id !== id),
        })),

      updateRecurringBill: (id, updates) =>
        set((state) => ({
          recurringBills: state.recurringBills.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      setCurrency: (currency) => set({ currency }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      seedData: () => {
        if (get().seeded) return;
        set({
          transactions: generateSeedTransactions(),
          recurringBills: generateSeedRecurringBills(),
          budgets: [
            { category: 'Food', limit: 400, period: 'monthly' },
            { category: 'Transport', limit: 150, period: 'monthly' },
            { category: 'Entertainment', limit: 100, period: 'monthly' },
            { category: 'Shopping', limit: 200, period: 'monthly' },
            { category: 'Bills', limit: 1500, period: 'monthly' },
            { category: 'Health', limit: 100, period: 'monthly' },
            { category: 'Education', limit: 75, period: 'monthly' },
          ],
          seeded: true,
        });
      },
    }),
    {
      name: 'quickbudget-storage',
    }
  )
);
