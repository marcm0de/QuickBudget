# 💰 QuickBudget

A minimal, privacy-first personal budget tracker that runs entirely in your browser. No account needed — your data never leaves your device.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Zero backend** — All data stored in localStorage
- **No account needed** — Start tracking instantly
- **Dashboard** — Monthly summary with income vs expenses, pie chart, bar chart
- **Transactions** — Searchable, filterable, sortable list with swipe-to-delete
- **Budget Limits** — Set monthly limits per category with visual progress bars
- **Recurring Bills** — Track subscriptions, rent, and recurring expenses
- **Analytics** — Month-over-month trends, top categories, daily averages
- **Quick Add** — Preset buttons for common expenses (coffee, lunch, gas, groceries)
- **CSV Export** — Download all transactions as a CSV file
- **Dark Mode** — Toggle between light and dark themes
- **Currency Selector** — Support for USD, EUR, GBP, CAD, AUD, JPY
- **Mobile-first** — Designed to work great on phone browsers

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/QuickBudget.git
cd QuickBudget

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (persisted to localStorage)
- **Charts:** [Recharts](https://recharts.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Date Utils:** [date-fns](https://date-fns.org/)

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Dashboard
│   ├── transactions/      # All transactions
│   ├── budgets/           # Budget limits
│   ├── recurring/         # Recurring bills
│   └── insights/          # Analytics
├── components/
│   ├── AddTransactionModal.tsx
│   ├── BottomNav.tsx
│   ├── Charts.tsx
│   ├── Header.tsx
│   ├── Providers.tsx
│   └── TransactionItem.tsx
├── lib/
│   ├── types.ts           # TypeScript types & constants
│   ├── utils.ts           # Utility functions
│   └── seed.ts            # Sample data generator
└── store/
    └── index.ts           # Zustand store
```

## 🔒 Privacy

QuickBudget is **100% client-side**. Your financial data:
- Lives only in your browser's localStorage
- Is never sent to any server
- Is never shared with third parties
- Can be exported as CSV anytime

To clear all data, open your browser's developer tools and clear localStorage for the site.

## 📊 Categories

**Expenses:** Food, Transport, Entertainment, Shopping, Bills, Health, Education, Other

**Income:** Salary, Freelance, Investment, Other

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ and a desire for simpler personal finance tools.
