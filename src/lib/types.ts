export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Health'
  | 'Education'
  | 'Other'
  | 'Salary'
  | 'Freelance'
  | 'Investment';

export type Frequency = 'weekly' | 'monthly' | 'yearly';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string; // ISO string
  isRecurring?: boolean;
}

export interface Budget {
  category: Category;
  limit: number;
  period: 'monthly';
}

export interface RecurringBill {
  id: string;
  name: string;
  amount: number;
  frequency: Frequency;
  nextDue: string; // ISO string
  category: Category;
}

export interface QuickPreset {
  label: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

export const EXPENSE_CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
  'Education',
  'Other',
];

export const INCOME_CATEGORIES: Category[] = ['Salary', 'Freelance', 'Investment', 'Other'];

export const ALL_CATEGORIES: Category[] = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Entertainment: '#a855f7',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Health: '#10b981',
  Education: '#6366f1',
  Other: '#6b7280',
  Salary: '#22c55e',
  Freelance: '#14b8a6',
  Investment: '#eab308',
};
