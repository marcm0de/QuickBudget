import { Transaction, Currency, CURRENCY_SYMBOLS } from './types';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getMonthTransactions(transactions: Transaction[], date: Date = new Date()): Transaction[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return transactions.filter((t) =>
    isWithinInterval(parseISO(t.date), { start, end })
  );
}

export function getMonthlyIncome(transactions: Transaction[], date?: Date): number {
  return getMonthTransactions(transactions, date)
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getMonthlyExpenses(transactions: Transaction[], date?: Date): number {
  return getMonthTransactions(transactions, date)
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getCategorySpending(transactions: Transaction[], date?: Date): Record<string, number> {
  const monthTxns = getMonthTransactions(transactions, date).filter((t) => t.type === 'expense');
  const spending: Record<string, number> = {};
  for (const t of monthTxns) {
    spending[t.category] = (spending[t.category] || 0) + t.amount;
  }
  return spending;
}

export function getDailySpending(transactions: Transaction[], date?: Date): { day: string; amount: number }[] {
  const monthTxns = getMonthTransactions(transactions, date).filter((t) => t.type === 'expense');
  const daily: Record<string, number> = {};
  for (const t of monthTxns) {
    const day = format(parseISO(t.date), 'MMM d');
    daily[day] = (daily[day] || 0) + t.amount;
  }
  return Object.entries(daily)
    .map(([day, amount]) => ({ day, amount }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

export function exportToCSV(transactions: Transaction[]): string {
  const header = 'Date,Type,Category,Description,Amount\n';
  const rows = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(
      (t) =>
        `${format(parseISO(t.date), 'yyyy-MM-dd')},${t.type},${t.category},"${t.description}",${t.amount.toFixed(2)}`
    )
    .join('\n');
  return header + rows;
}

export function downloadCSV(csv: string, filename: string = 'quickbudget-export.csv') {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function parseCSV(csvText: string): Omit<Transaction, 'id'>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase();
  const hasHeader = header.includes('date') || header.includes('amount') || header.includes('type');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const results: Omit<Transaction, 'id'>[] = [];

  for (const line of dataLines) {
    if (!line.trim()) continue;

    // Handle CSV with quoted fields
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    if (fields.length < 3) continue;

    // Try to parse: Date, Type, Category, Description, Amount
    // Or: Date, Description, Amount (auto-detect type)
    let date: string;
    let type: 'income' | 'expense';
    let category: string;
    let description: string;
    let amount: number;

    if (fields.length >= 5) {
      date = fields[0];
      type = fields[1].toLowerCase() === 'income' ? 'income' : 'expense';
      category = fields[2];
      description = fields[3];
      amount = Math.abs(parseFloat(fields[4]));
    } else {
      // Simplified format: Date, Description, Amount
      date = fields[0];
      description = fields[1];
      const rawAmount = parseFloat(fields[2]);
      amount = Math.abs(rawAmount);
      type = rawAmount >= 0 ? 'income' : 'expense';
      category = type === 'income' ? 'Salary' : 'Other';
    }

    if (isNaN(amount) || amount === 0) continue;

    // Parse date - try common formats
    let parsedDate: Date;
    try {
      parsedDate = parseISO(date);
      if (isNaN(parsedDate.getTime())) {
        parsedDate = new Date(date);
      }
    } catch {
      parsedDate = new Date(date);
    }

    if (isNaN(parsedDate.getTime())) continue;

    results.push({
      amount,
      type,
      category: category as Transaction['category'],
      description,
      date: parsedDate.toISOString(),
    });
  }

  return results;
}
