# ☕ Brew-Bite Dashboard

> A full-featured admin dashboard for managing cafe operations — orders, menu, staff, and analytics, all in one place.

![Dashboard Preview](./public/logo-dark.png)

---

## 🌐 Live Demo

🔗 **[brew-bite-dashboard.netlify.app](https://brew-bite-dashboard.netlify.app)** ← _replace with your actual URL_

> A demo account is available on the login page for recruiters and clients to explore the dashboard.

---

## Demo account
Email: demo@brewbite-pos.app
Password: demo1234

## ✨ Features

- 🧾 **Order Panel** — real-time order tracking with status updates (Preparing → Ready → Delivered), search, and sort
- 📋 **Order Management** — full order history with payment status, pickup/delivery type, and order details
- 🍽️ **Menu Management** — add, edit, delete, and toggle availability of menu items with image support
- 👥 **User Management** — manage staff accounts with role-based access (Admin / Cashier)
- 📊 **Reports & Analytics** — daily revenue trends, peak hours, top products, and customer stats via Recharts
- 🌍 **i18n (EN / ID)** — full English and Bahasa Indonesia support via react-i18next
- 🌙 **Dark mode** — persistent theme toggle across sessions
- 💱 **Currency switcher** — configurable currency display in system settings
- 🔐 **Auth & role guards** — Supabase Auth with protected routes and role-based page access

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev) + [Vite](https://vitejs.dev) |
| Routing | [React Router v7](https://reactrouter.com) |
| UI | [Tailwind CSS](https://tailwindcss.com) |
| Data Fetching | [TanStack Query (React Query)](https://tanstack.com/query) |
| Charts | [Recharts](https://recharts.org) |
| Backend / DB | [Supabase](https://supabase.com) (Auth, PostgreSQL, Storage) |
| i18n | [react-i18next](https://react.i18next.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Notifications | [React Hot Toast](https://react-hot-toast.com) |
| Deployment | [Netlify](https://netlify.com) |

---

## 🔐 Authentication

- Email & password login via **Supabase Auth**
- Auth state managed globally with React Context
- Role-based route guards — admin-only pages (User Management, Reports, Settings) are protected at the router level
- Persistent session across page reloads

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Eyasdm/brew-bite-dashboard.git
cd brew-bite-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> You can find these in your [Supabase project dashboard](https://supabase.com/dashboard) under **Project Settings → API**.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗂️ Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── charts/        # Recharts chart components
│   └── reports/       # Reports-specific stat blocks
├── constants/         # Filter options, query keys, settings constants
├── context/           # DarkModeContext, CurrencyContext
├── hooks/             # Custom data hooks (orders, menu, users, etc.)
├── i18n/              # Translation files (EN / ID)
│   ├── en/
│   └── id/
├── pages/             # Application pages / route views
├── routes/            # Route guards (ProtectedRoute, RoleGuard)
├── services/          # Supabase client + data service functions
├── state/             # AuthProvider, useAuthSession, useAuthProfile
├── utils/             # Currency formatters, report aggregations
├── App.jsx            # Root router
└── main.jsx           # Entry point
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ☕ by <a href="https://github.com/Eyasdm">Eyas</a></p>


## Currency Conversion

The IDR conversion in `src/utils/formatCurrency.js` uses a fixed demo rate (`USD_TO_IDR_RATE = 16200`). This is intentional for a portfolio/demo project — it is not fetched live. Update the constant if you need a more current rate.
