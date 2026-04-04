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
  type: TransactionType; // 'income' or 'expense'
}

export interface QuickPreset {
  label: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // ISO string
  createdAt: string; // ISO string
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
  Food: '#fb923c',
  Transport: '#60a5fa',
  Entertainment: '#c084fc',
  Shopping: '#f472b6',
  Bills: '#f87171',
  Health: '#34d399',
  Education: '#818cf8',
  Other: '#94a3b8',
  Salary: '#4ade80',
  Freelance: '#2dd4bf',
  Investment: '#fbbf24',
};
