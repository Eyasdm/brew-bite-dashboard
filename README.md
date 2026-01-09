# Brew-Bite Dashboard ☕️

**Brew-Bite Dashboard** is a modern and responsive admin panel built to manage cafe and restaurant operations efficiently.
The system provides real-time order tracking, order status management, menu control, user management, and analytics
through a clean and intuitive interface.

This dashboard is designed to be fast, scalable, and easy to maintain, making it suitable for real-world POS
(Point of Sale) and order management systems.

---

## ✨ Features

- 📦 **Order Panel**

  - View and track daily orders in real time
  - Order status management (Preparing, Ready, Delivered)
  - Search and filter orders by status, time, or customer

- 🛒 **Order Management**

  - Detailed order view
  - Payment status tracking
  - Pickup and delivery support

- 🍽 **Menu Management**

  - Add, update, and remove menu items
  - Control item availability

- 👥 **User Management**

  - Manage staff and system users
  - Role-based access (admin / manager)

- 📊 **Reports & Analytics**

  - Daily order statistics
  - Performance insights
  - Sales overview

- 🎨 **Modern UI**
  - Clean dashboard layout
  - Fully responsive design
  - Optimized for desktop and tablet use

---

## 🧱 Tech Stack

### Frontend

- **React** – Component-based UI development
- **React Query (TanStack Query)** – Server state management and caching
- **Tailwind CSS** – Utility-first styling
- **Vite** – Fast development and build tool
- **React Router** – Client-side routing
- **Axios** – API communication

### Backend

- **Supabase**
  - Authentication
  - Database (PostgreSQL)
  - Real-time subscriptions
  - Storage

---

## 🔐 Authentication & Data

- User authentication handled via **Supabase Auth**
- Real-time order updates using **Supabase subscriptions**
- Secure API access with environment variables
