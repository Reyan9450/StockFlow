# Stockify — Inventory Management System

> A production-ready, cloud-based inventory, customer, and order management platform built with React, FastAPI, and PostgreSQL.

![Stockify Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow) [![Docker](https://img.shields.io/badge/Docker-reyan9450%2Fstockify--backend-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/r/reyan9450/stockify-backend)

---

## � Docker Images

| Image | Link |
|---|---|
| **Backend** | [hub.docker.com/r/reyan9450/stockify-backend](https://hub.docker.com/r/reyan9450/stockify-backend) |

Pull and run the backend directly:

```bash
docker pull reyan9450/stockify-backend
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e SECRET_KEY=your-secret-key \
  -e CORS_ORIGINS=http://localhost:3001 \
  reyan9450/stockify-backend
```

---

## �🔗 Live Demo

| Service | URL |
|---|---|
| **Frontend (Vercel)** | [stock-flow-sage-two.vercel.app](https://stock-flow-sage-two.vercel.app) |
| **Backend API (Railway)** | [hopeful-creativity-production-a7d1.up.railway.app](https://hopeful-creativity-production-a7d1.up.railway.app) |
| **API Docs (Swagger)** | [/docs](https://hopeful-creativity-production-a7d1.up.railway.app/docs) |

### Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| Manager | `manager@stockify.io` | `manager123` | Full access — create, edit, delete |
| Viewer | `viewer@stockify.io` | `viewer123` | Read-only — view data only |

---

## Overview

Stockify is a modern SaaS-grade inventory management system designed to look and feel like a commercially funded product. It features a premium dashboard, real-time stock tracking, order management, customer CRM, warehouse visualization, and analytics — all wrapped in a polished dark/light UI with role-based access control.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
│                                                         │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
│  │   Frontend   │   │   Backend    │   │ PostgreSQL │  │
│  │  React/Vite  │──▶│   FastAPI    │──▶│  Database  │  │
│  │  Port: 3001  │   │  Port: 8001  │   │ Port: 5433 │  │
│  └──────────────┘   └──────────────┘   └────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + Recharts  
**Backend:** FastAPI + SQLAlchemy ORM + Pydantic v2  
**Database:** PostgreSQL 16  
**Containerization:** Docker + Docker Compose  
**Deployment:** Vercel (frontend) + Railway (backend + database)

---

## Features

- **Dashboard** — KPI cards, revenue area chart, weekly orders bar chart, warehouse grid, recent orders table, low stock alerts
- **Products** — Full CRUD with search, category filter, stock status badges, SKU uniqueness enforcement
- **Customers** — CRM-style card/table view toggle, customer profiles with order counts
- **Orders** — Create orders with multi-item support, automatic stock reduction, expandable order cards
- **Inventory** — Warehouse floor plan visualization (A1–D6), utilization gauge, stock distribution chart
- **Analytics** — Revenue trend, orders trend, customer growth, top products, inventory turnover
- **Settings** — Profile, theme (dark/light), notifications, API settings, security
- **Dark Mode** — Full dark theme persisted in localStorage
- **Role-Based Access** — Manager (full access) and Viewer (read-only) roles

---

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

### Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Reyan9450/StockFlow.git
cd StockFlow

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker compose up --build

# 4. Open the app
# Frontend: http://localhost:3001
# API Docs: http://localhost:8001/docs
```

The database is seeded automatically with sample products, customers, and orders on first run.

---

### Local Development

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your local PostgreSQL credentials

# Start the server
uvicorn app.main:app --reload --port 8000

# Seed sample data (optional)
python -m app.seed
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
# Open http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://stockflow:stockflow123@localhost:5432/stockflow_db` |
| `SECRET_KEY` | Session secret key | `supersecretkey-change-in-production` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173,http://localhost:3001` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8001` |

---

## API Documentation

Interactive API docs available at:
- **Swagger UI:** `https://hopeful-creativity-production-a7d1.up.railway.app/docs`
- **ReDoc:** `https://hopeful-creativity-production-a7d1.up.railway.app/redoc`

### Endpoints

#### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | List all products (supports `?search=` and `?category=`) |
| `POST` | `/products` | Create a new product |
| `GET` | `/products/{id}` | Get product by ID |
| `PUT` | `/products/{id}` | Update product |
| `DELETE` | `/products/{id}` | Delete product |

#### Customers
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/customers` | List all customers (supports `?search=`) |
| `POST` | `/customers` | Create a new customer |
| `GET` | `/customers/{id}` | Get customer by ID |
| `DELETE` | `/customers/{id}` | Delete customer |

#### Orders
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/orders` | List all orders (supports `?status=`) |
| `POST` | `/orders` | Create a new order (auto-reduces stock) |
| `GET` | `/orders/{id}` | Get order by ID |
| `DELETE` | `/orders/{id}` | Delete order (auto-restores stock) |

#### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/stats` | Get KPI stats, low stock, recent orders |

### Business Rules

- **SKU Uniqueness** — Duplicate SKUs rejected with `409 Conflict`
- **Email Uniqueness** — Duplicate customer emails rejected with `409 Conflict`
- **Non-negative Quantities** — Validated at API level with `422 Unprocessable Entity`
- **Stock Validation** — Orders rejected if requested quantity exceeds available stock
- **Automatic Stock Reduction** — Stock reduced atomically when an order is created
- **Automatic Total Calculation** — Backend calculates order totals; frontend values are ignored

---

## Deployment

### Frontend → Vercel

1. Import repo on [Vercel](https://vercel.com)
2. Set **Root Directory** → `frontend`
3. Set **Framework Preset** → `Vite`
4. Add environment variable:
   - `VITE_API_URL` → your Railway backend URL (must be `https://`)
5. Deploy

### Backend → Railway

> **Or use the pre-built Docker image:** [`reyan9450/stockify-backend`](https://hub.docker.com/r/reyan9450/stockify-backend)

1. Create new project on [Railway](https://railway.app)
2. Add **PostgreSQL** plugin — Railway injects `DATABASE_URL` automatically
3. Deploy backend service with **Root Directory** → `backend`
4. Add environment variables:
   - `DATABASE_URL` → reference from Postgres plugin
   - `SECRET_KEY` → any random string
   - `CORS_ORIGINS` → your Vercel frontend URL
5. After deploy, seed data via Railway Shell: `python -m app.seed`

---

## Project Structure

```
stockify/
├── backend/
│   ├── app/
│   │   ├── config.py          # Settings via pydantic-settings
│   │   ├── database.py        # SQLAlchemy engine & session
│   │   ├── main.py            # FastAPI app, CORS, routers
│   │   ├── models.py          # SQLAlchemy ORM models
│   │   ├── schemas.py         # Pydantic request/response schemas
│   │   ├── seed.py            # Sample data seeder
│   │   └── routers/
│   │       ├── products.py
│   │       ├── customers.py
│   │       ├── orders.py
│   │       └── dashboard.py
│   ├── Dockerfile
│   ├── railway.toml
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Router + auth gate
│   │   ├── components/
│   │   │   ├── layout/        # AppLayout, Sidebar, TopNav
│   │   │   └── ui/            # Button, Modal, Input, Badge, Skeleton, StatCard
│   │   ├── hooks/
│   │   │   ├── useAuth.ts     # Auth state + role-based access
│   │   │   └── useTheme.ts    # Dark/light mode
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── Inventory.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Help.tsx
│   │   │   └── Login.tsx
│   │   ├── services/
│   │   │   └── api.ts         # Axios API client
│   │   └── types/
│   │       └── index.ts       # TypeScript interfaces
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vercel.json
│   ├── railway.toml
│   └── vite.config.ts
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 + CSS Variables |
| Animations | Framer Motion |
| Charts | Recharts |
| State Management | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Notifications | Sonner |
| Backend Framework | FastAPI |
| ORM | SQLAlchemy 2.0 |
| Validation | Pydantic v2 |
| Database | PostgreSQL 16 |
| Containerization | Docker + Docker Compose |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |
| Web Server | Nginx (Docker) |

---

## Future Improvements

- [ ] JWT authentication with proper token-based auth
- [ ] Alembic database migrations
- [ ] CSV/Excel export for products, orders, customers
- [ ] Order status update (PATCH endpoint)
- [ ] Email notifications for low stock and new orders
- [ ] Barcode/QR code scanning support
- [ ] Multi-warehouse support
- [ ] Supplier management module
- [ ] Purchase order (PO) workflow
- [ ] Real-time updates via WebSockets
- [ ] Mobile app (React Native)
- [ ] Advanced reporting with date range filters
- [ ] Bulk import via CSV

---

## License

MIT © Stockify
