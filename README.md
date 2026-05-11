# WardSuite ERP

A modular, production-ready ERP proof of concept with SCM (Supply Chain Management) and CRM (Customer Relationship Management) modules, built on React + Express + TypeScript + Firestore.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Motion |
| State | Zustand (auth + UI), React hooks per module |
| Backend | Express 4, TypeScript, tsx |
| Database | Firestore (Firebase Admin SDK) |
| Auth | Token-based sessions (in-memory, swap for JWT/Redis in prod) |
| Drag & Drop | @hello-pangea/dnd |
| Tables | TanStack Table v8 |
| Deployment | Docker + docker-compose, PM2 |
| Build | Vite (frontend), esbuild (API bundle) |

---

## Project Structure

```
wardsuitepro/
├── src/                        # React frontend
│   ├── components/
│   │   ├── auth/               # AuthGuard (route protection)
│   │   ├── crm/                # CRM components (leads, deals, activities)
│   │   ├── layout/             # Shell, Sidebar
│   │   └── ui/                 # Shared UI: Modals, DataTable, Skeleton
│   ├── hooks/
│   │   ├── crm/                # useLeads, useCustomers, useDeals, useActivities
│   │   └── useDashboardStats
│   ├── modules/
│   │   ├── crm/                # Leads, Customers, Activities pages
│   │   ├── scm/                # Suppliers, Products pages
│   │   └── core/               # Settings, ActivityLogs
│   ├── services/               # REST API clients (auth, leads, customers, deals…)
│   ├── store/
│   │   └── auth.store.ts       # Zustand auth store (persisted)
│   └── types.ts
│
├── server/                     # Express API
│   ├── core/
│   │   ├── database/           # Firestore client, seed, migrations
│   │   └── middleware/         # auth.middleware, error.middleware
│   └── modules/
│       ├── auth/               # Login, logout, /me
│       ├── crm/                # leads, customers, deals, activities
│       ├── dashboard/
│       └── scm/                # suppliers, products, purchase-requests, stock-movements
│
├── ecosystem.config.js         # PM2 config
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # VPS deployment
├── nx.json                     # NX workspace config
├── firestore.rules
├── firestore.indexes.json
└── server.ts                   # Express entry point
```

---

## Getting Started

### Prerequisites
- Node.js 22+
- Firebase project with Firestore enabled
- `.env` file (see below)

### Environment Variables

Copy `.env.example` (or create `.env`) with:

```env
# Firebase Admin (server)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Web SDK (Vite frontend)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Optional: named Firestore database
VITE_FIREBASE_DATABASE_ID=
```

### Development

```bash
npm install

# Start API server (port 3000, serves frontend via /api)
npm run dev

# Or run frontend dev server separately (HMR)
npm run dev:web
```

### Database Setup

```bash
# Seed Firestore with demo data
npm run firebase:seed

# Run pending migrations
npm run firebase:migrate

# Deploy Firestore security rules
npm run firebase:rules

# Deploy Firestore indexes
npm run firebase:indexes
```

---

## Demo Credentials

| Email | Password | Role |
|---|---|---|
| admin@wardsuite.com | admin123 | ADMIN |
| manager@wardsuite.com | manager123 | MANAGER |
| staff@wardsuite.com | staff123 | STAFF |

---

## Authentication Flow

1. User submits login form → POST `/api/auth/login`
2. Server returns `{ token, user }` → stored in Zustand (`persist` → `localStorage`)
3. `api.client.ts` reads the token from `localStorage` and injects `Authorization: Bearer <token>` on every request
4. `AuthGuard` wraps all protected routes — redirects to `/login` if unauthenticated
5. 401 responses automatically clear the session and redirect to login

---

## Production Deployment

### Docker (recommended for VPS)

```bash
# Build image
npm run docker:build

# Start container
npm run docker:up

# Tail logs
npm run docker:logs

# Stop
npm run docker:down
```

### PM2 (direct on VPS)

```bash
npm run build
npm run start:pm2

# Logs
npm run logs:pm2

# Stop
npm run stop:pm2
```

---

## NX Workspace

The project uses [NX](https://nx.dev) for task orchestration and caching. Projects are defined in `nx.json`:

| Project | Root | Type |
|---|---|---|
| `web` | `.` | React SPA (Vite) |
| `api` | `server/` | Express API |

```bash
# Install NX CLI (optional, scripts work without it)
npm install -g nx

# Run tasks
nx build web
nx dev api
```

---

## Modules

### CRM
- **Leads** — Kanban + table view, CSV import with column mapper, status drag-and-drop
- **Customers** — Full CRUD, customer cards
- **Pipeline** — Deal Kanban (open → proposal → negotiation → won/lost), drag-and-drop stage changes
- **Activities** — Timeline log with type filters (call, meeting, note, email, audit)

### SCM
- **Suppliers** — Supplier management
- **Products** — Product catalog with stock levels

### Core
- **Dashboard** — Revenue stats, pipeline summary
- **Settings** — Profile, security, alerts, regional preferences (reads from auth store)
- **Activity Logs** — System-wide audit trail

---

## Scripts Reference

| Script | Description |
|---|---|
| `npm run dev` | Start API + serve built frontend |
| `npm run dev:web` | Vite dev server with HMR |
| `npm run build` | Build frontend (Vite) + bundle API (esbuild) |
| `npm run lint` | TypeScript type check |
| `npm run firebase:seed` | Seed Firestore with demo data |
| `npm run firebase:migrate` | Run pending Firestore migrations |
| `npm run docker:up` | Start Docker containers |
| `npm run start:pm2` | Start with PM2 in production mode |
