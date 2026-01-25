# Brew-Bite Dashboard ☕️

**Brew-Bite Dashboard** is a modern admin dashboard for managing cafe and restaurant operations.
The project focuses on clean code, scalability, and real-world POS (Point of Sale) workflows.

It includes order tracking, menu management, user roles, and analytics,
built with a clear and maintainable frontend architecture.

---

## ✨ Features

- 📦 **Order Panel**
  - Real-time order tracking
  - Order status management (Preparing, Ready, Delivered)
  - Search and filter orders

- 🛒 **Order Management**
  - View order details
  - Payment status tracking
  - Pickup and delivery support

- 🍽 **Menu Management**
  - Add, update, and delete menu items
  - Control item availability

- 👥 **User Management**
  - Manage staff and system users
  - Role-based access control (Admin / Manager)

- 📊 **Reports & Analytics**
  - Daily order statistics
  - Sales overview

- 🎨 **Modern UI**
  - Responsive dashboard layout
  - Optimized for desktop and tablet

---

## 🧱 Tech Stack

### Frontend

- **React**
- **Vite**
- **React Router**
- **TanStack Query (React Query)**
- **Tailwind CSS**

### Backend

- **Supabase**
  - Authentication
  - PostgreSQL Database
  - Real-time subscriptions
  - Storage

---

## 🔐 Authentication

- Authentication is handled using **Supabase Auth**
- Email & Password login
- Role-based access using user profiles
- Auth state is managed globally using React Context

---

## 📁 Project Structure

```txt
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components
├── pages/           # Application pages
├── routes/          # Route definitions & guards
├── auth/            # Authentication logic (context & hooks)
│   ├── AuthProvider.jsx
│   ├── useAuthSession.js
│   └── useAuthProfile.js
├── services/        # External services (Supabase, API calls)
│   ├── supabase.js
│   ├── users.service.js
│   ├── orders.service.js
│   └── menu.service.js
├── hooks/           # Custom reusable hooks
├── utils/           # Helper functions
├── state/           # Global state (if needed)
├── App.jsx
└── main.jsx
```
