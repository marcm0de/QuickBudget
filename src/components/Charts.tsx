'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, Legend } from 'recharts';
import { CATEGORY_COLORS, Category } from '@/lib/types';

interface PieData {
  name: string;
  value: number;
}

interface BarData {
  day: string;
  amount: number;
}

interface LineData {
  month: string;
  income: number;
  expenses: number;
}

export function SpendingPieChart({ data }: { data: PieData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-stone-400 text-sm">
        No spending data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={CATEGORY_COLORS[entry.name as Category] || '#6b7280'}
              strokeWidth={0}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, '']}
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '12px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function DailyBarChart({ data }: { data: BarData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-stone-400 text-sm">
        No spending data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spent']}
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({ data }: { data: LineData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-stone-400 text-sm">
        Not enough data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} width={50} />
        <Tooltip
          formatter={(value) => `$${Number(value).toFixed(2)}`}
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '12px',
          }}
        />
        <Legend />
        <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGradient)" dot={{ r: 4 }} />
        <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGradient)" dot={{ r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
