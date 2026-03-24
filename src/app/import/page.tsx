'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useBudgetStore } from '@/store';
import { parseCSV, formatCurrency } from '@/lib/utils';
import { Transaction } from '@/lib/types';

export default function ImportPage() {
  const { importTransactions, currency } = useBudgetStore();
  const [preview, setPreview] = useState<Omit<Transaction, 'id'>[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [imported, setImported] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError('');
    setImported(false);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setError('No valid transactions found in CSV. Expected format: Date, Type, Category, Description, Amount');
          return;
        }
        setPreview(parsed);
      } catch {
        setError('Failed to parse CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
      handleFile(file);
    } else {
      setError('Please upload a CSV file');
    }
  }

  function handleImport() {
    importTransactions(preview);
    setImported(true);
    setPreview([]);
  }

  function reset() {
    setPreview([]);
    setFileName('');
    setError('');
    setImported(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Import Data</h2>
        <p className="text-sm text-stone-400 dark:text-stone-500">Import transactions from a CSV file</p>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {imported && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle size={20} className="text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Import successful!</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Transactions have been added to your account.</p>
            </div>
            <button onClick={reset} className="ml-auto p-1">
              <X size={16} className="text-emerald-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="bg-white dark:bg-stone-900 rounded-2xl p-8 shadow-sm border-2 border-dashed border-stone-200 dark:border-stone-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer text-center"
      >
        <Upload size={32} className="mx-auto text-stone-300 dark:text-stone-600 mb-3" />
        <p className="text-sm text-stone-600 dark:text-stone-300 font-medium">
          Drop a CSV file here or click to browse
        </p>
        <p className="text-xs text-stone-400 mt-1">
          Format: Date, Type, Category, Description, Amount
        </p>
        {fileName && (
          <p className="text-xs text-emerald-500 mt-2 flex items-center justify-center gap-1">
            <FileText size={12} /> {fileName}
          </p>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Preview */}
      <AnimatePresence>
        {preview.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                <span className="font-semibold">{preview.length}</span> transactions found
              </p>
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="px-3 py-1.5 text-xs font-medium text-stone-500 bg-stone-100 dark:bg-stone-800 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Import All
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm divide-y divide-stone-100 dark:divide-stone-800 max-h-80 overflow-y-auto">
              {preview.slice(0, 20).map((t, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-stone-800 dark:text-stone-100">{t.description}</p>
                    <p className="text-xs text-stone-400">
                      {new Date(t.date).toLocaleDateString()} · {t.category}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                  </span>
                </div>
              ))}
              {preview.length > 20 && (
                <div className="px-4 py-3 text-center text-xs text-stone-400">
                  ...and {preview.length - 20} more
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSV Format help */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">CSV Format</h3>
        <div className="bg-stone-50 dark:bg-stone-800 rounded-xl p-3 font-mono text-xs text-stone-600 dark:text-stone-300 overflow-x-auto">
          <p className="text-stone-400 mb-1"># Full format:</p>
          <p>Date,Type,Category,Description,Amount</p>
          <p>2024-03-01,expense,Food,&quot;Grocery store&quot;,85.50</p>
          <p>2024-03-02,income,Salary,&quot;Monthly pay&quot;,4500.00</p>
          <p className="text-stone-400 mt-2 mb-1"># Simple format (positive=income, negative=expense):</p>
          <p>Date,Description,Amount</p>
          <p>2024-03-01,&quot;Coffee shop&quot;,-4.50</p>
        </div>
      </div>
    </div>
  );
}
