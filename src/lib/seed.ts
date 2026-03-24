import { Transaction, RecurringBill } from './types';
import { subDays, format } from 'date-fns';

function genId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function generateSeedTransactions(): Transaction[] {
  const today = new Date();
  const txns: Transaction[] = [
    // Salaries
    { id: genId(), amount: 4200, type: 'income', category: 'Salary', description: 'Monthly salary', date: subDays(today, 1).toISOString() },
    { id: genId(), amount: 4200, type: 'income', category: 'Salary', description: 'Monthly salary', date: subDays(today, 31).toISOString() },
    // Freelance
    { id: genId(), amount: 750, type: 'income', category: 'Freelance', description: 'Logo design project', date: subDays(today, 12).toISOString() },
    { id: genId(), amount: 500, type: 'income', category: 'Freelance', description: 'Website consultation', date: subDays(today, 38).toISOString() },
    // Food
    { id: genId(), amount: 45.80, type: 'expense', category: 'Food', description: 'Whole Foods groceries', date: subDays(today, 2).toISOString() },
    { id: genId(), amount: 12.50, type: 'expense', category: 'Food', description: 'Chipotle lunch', date: subDays(today, 4).toISOString() },
    { id: genId(), amount: 68.30, type: 'expense', category: 'Food', description: 'Weekly groceries', date: subDays(today, 9).toISOString() },
    { id: genId(), amount: 22.00, type: 'expense', category: 'Food', description: 'Pizza delivery', date: subDays(today, 15).toISOString() },
    { id: genId(), amount: 35.40, type: 'expense', category: 'Food', description: 'Trader Joe\'s run', date: subDays(today, 33).toISOString() },
    { id: genId(), amount: 55.00, type: 'expense', category: 'Food', description: 'Dinner out', date: subDays(today, 40).toISOString() },
    // Transport
    { id: genId(), amount: 50.00, type: 'expense', category: 'Transport', description: 'Gas fill-up', date: subDays(today, 3).toISOString() },
    { id: genId(), amount: 2.75, type: 'expense', category: 'Transport', description: 'Subway fare', date: subDays(today, 7).toISOString() },
    { id: genId(), amount: 35.00, type: 'expense', category: 'Transport', description: 'Uber ride', date: subDays(today, 20).toISOString() },
    { id: genId(), amount: 48.00, type: 'expense', category: 'Transport', description: 'Gas fill-up', date: subDays(today, 35).toISOString() },
    // Entertainment
    { id: genId(), amount: 15.99, type: 'expense', category: 'Entertainment', description: 'Netflix subscription', date: subDays(today, 5).toISOString(), isRecurring: true },
    { id: genId(), amount: 25.00, type: 'expense', category: 'Entertainment', description: 'Movie tickets', date: subDays(today, 14).toISOString() },
    { id: genId(), amount: 59.99, type: 'expense', category: 'Entertainment', description: 'Concert ticket', date: subDays(today, 42).toISOString() },
    // Shopping
    { id: genId(), amount: 89.99, type: 'expense', category: 'Shopping', description: 'New running shoes', date: subDays(today, 8).toISOString() },
    { id: genId(), amount: 34.50, type: 'expense', category: 'Shopping', description: 'Amazon order', date: subDays(today, 18).toISOString() },
    { id: genId(), amount: 120.00, type: 'expense', category: 'Shopping', description: 'Winter jacket', date: subDays(today, 45).toISOString() },
    // Bills
    { id: genId(), amount: 1200, type: 'expense', category: 'Bills', description: 'Rent', date: subDays(today, 1).toISOString(), isRecurring: true },
    { id: genId(), amount: 1200, type: 'expense', category: 'Bills', description: 'Rent', date: subDays(today, 31).toISOString(), isRecurring: true },
    { id: genId(), amount: 85.00, type: 'expense', category: 'Bills', description: 'Electric bill', date: subDays(today, 10).toISOString() },
    { id: genId(), amount: 60.00, type: 'expense', category: 'Bills', description: 'Internet bill', date: subDays(today, 11).toISOString(), isRecurring: true },
    // Health
    { id: genId(), amount: 40.00, type: 'expense', category: 'Health', description: 'Gym membership', date: subDays(today, 1).toISOString(), isRecurring: true },
    { id: genId(), amount: 25.00, type: 'expense', category: 'Health', description: 'Vitamins', date: subDays(today, 22).toISOString() },
    { id: genId(), amount: 150.00, type: 'expense', category: 'Health', description: 'Dentist copay', date: subDays(today, 50).toISOString() },
    // Education
    { id: genId(), amount: 29.99, type: 'expense', category: 'Education', description: 'Udemy course', date: subDays(today, 16).toISOString() },
    { id: genId(), amount: 14.99, type: 'expense', category: 'Education', description: 'Kindle book', date: subDays(today, 28).toISOString() },
    // Investment income
    { id: genId(), amount: 120.00, type: 'income', category: 'Investment', description: 'Dividend payout', date: subDays(today, 25).toISOString() },
  ];
  return txns;
}

export function generateSeedRecurringBills(): RecurringBill[] {
  const today = new Date();
  return [
    { id: genId(), name: 'Rent', amount: 1200, frequency: 'monthly', nextDue: format(subDays(today, -6), 'yyyy-MM-dd'), category: 'Bills' },
    { id: genId(), name: 'Netflix', amount: 15.99, frequency: 'monthly', nextDue: format(subDays(today, -25), 'yyyy-MM-dd'), category: 'Entertainment' },
    { id: genId(), name: 'Internet', amount: 60, frequency: 'monthly', nextDue: format(subDays(today, -19), 'yyyy-MM-dd'), category: 'Bills' },
    { id: genId(), name: 'Gym', amount: 40, frequency: 'monthly', nextDue: format(subDays(today, -29), 'yyyy-MM-dd'), category: 'Health' },
    { id: genId(), name: 'Spotify', amount: 10.99, frequency: 'monthly', nextDue: format(subDays(today, -13), 'yyyy-MM-dd'), category: 'Entertainment' },
  ];
}
