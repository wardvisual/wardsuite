# WardSuite ERP — Proof of Concept

A modular ERP proof of concept demonstrating SCM (Supply Chain Management) and CRM (Customer Relationship Management) built on React + Node.js + TypeScript with Firestore as the real-time document store.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4, React Router v7 |
| Backend | Node.js, Express.js, TypeScript |
| Real-time DB | Firestore (Firebase v12) |
| Build / Dev | Vite 6, esbuild, tsx |
| Forms | React Hook Form, Zod |
| Tables | TanStack Table v8 |
| Charts | Recharts |

### Why Firestore?

Firestore handles flexible document-style records (activity logs, audit trails, notifications) and provides real-time listeners for live dashboard updates. In a production system, structured transactional data (users, suppliers, products, deals) would live in MySQL; this PoC keeps all persistence in-memory on the server and uses Firestore listeners on the frontend for real-time sync.

---

## Project Structure

```
wardsuitepro/
├── server.ts                     # Express entry point
├── server/
│   ├── routes/
│   │   ├── index.ts              # Main router — mounts all sub-routers
│   │   ├── authRoutes.ts         # /api/auth/*
│   │   ├── statsRoutes.ts        # /api/dashboard/stats
│   │   ├── scm/
│   │   │   ├── supplierRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   ├── purchaseRequestRoutes.ts
│   │   │   └── stockMovementRoutes.ts
│   │   └── crm/
│   │       ├── leadRoutes.ts
│   │       ├── customerRoutes.ts
│   │       ├── dealRoutes.ts
│   │       └── activityRoutes.ts
│   ├── services/                 # Business logic layer
│   ├── dto/                      # Request shape interfaces
│   ├── types/
│   │   └── models.ts             # All entity interfaces and enums
│   ├── middleware/
│   │   └── errorHandler.ts       # Global Express error handler
│   └── utils/
│       └── response.ts           # ok() / fail() response helpers
│
└── src/                          # React frontend
    ├── modules/
    │   ├── crm/  (Leads, Customers)
    │   ├── scm/  (Suppliers, Products)
    │   └── core/ (ActivityLogs, Settings)
    ├── components/
    ├── hooks/
    └── lib/
        └── firebase.ts           # Firestore + Auth initialisation
```

---

## How to Run

```bash
npm install
npm run dev        # starts Express + Vite on http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

---

## Available Modules

### SCM — Supply Chain Management

| Module | Description |
|---|---|
| Suppliers | Supplier master records — CRUD + search |
| Products | Product catalog with low-stock detection |
| Purchase Requests | Multi-line purchase orders with status workflow |
| Stock Movements | In / Out / Adjustment with automatic stock update |

### CRM — Customer Relationship Management

| Module | Description |
|---|---|
| Leads | Lead pipeline with status filter and CSV import/export |
| Customers | Customer master records; auto-created on lead conversion |
| Deals | Sales opportunities with stage tracking |
| Activities | Call, meeting, note, email log linked to any entity |

### Core

| Module | Description |
|---|---|
| Auth | Login / logout / me with in-memory token sessions |
| Dashboard | Live aggregated stats from all modules |

---

## API Reference

### Response Envelope

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [],
  "meta": { "total": 10 }
}
```

Error:

```json
{ "success": false, "message": "Validation error message" }
```

---

### Auth  `/api/auth`

| Method | Path | Body / Notes |
|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` |
| POST | `/api/auth/logout` | `Authorization: Bearer <token>` |
| GET | `/api/auth/me` | `Authorization: Bearer <token>` |

**Demo accounts**

| Email | Password | Role |
|---|---|---|
| admin@wardsuite.com | admin123 | ADMIN |
| manager@wardsuite.com | manager123 | MANAGER |
| staff@wardsuite.com | staff123 | STAFF |

---

### SCM — Suppliers  `/api/scm/suppliers`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/scm/suppliers` | `?search=` |
| GET | `/api/scm/suppliers/:id` | |
| POST | `/api/scm/suppliers` | name, contactPerson, email, phone, address required |
| PUT | `/api/scm/suppliers/:id` | |
| DELETE | `/api/scm/suppliers/:id` | |

---

### SCM — Products  `/api/scm/products`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/scm/products` | `?search=` |
| GET | `/api/scm/products/:id` | |
| POST | `/api/scm/products` | name, category, unit, costPrice, sellingPrice, currentStock, reorderLevel required |
| PUT | `/api/scm/products/:id` | |
| DELETE | `/api/scm/products/:id` | |

---

### SCM — Purchase Requests  `/api/scm/purchase-requests`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/scm/purchase-requests` | |
| GET | `/api/scm/purchase-requests/:id` | |
| POST | `/api/scm/purchase-requests` | supplierId, requestedById, items[] required |
| PUT | `/api/scm/purchase-requests/:id` | |
| PATCH | `/api/scm/purchase-requests/:id/status` | `{ status }` |

Statuses: `draft` > `submitted` > `approved` > `ordered` > `received` (or `rejected`)

---

### SCM — Stock Movements  `/api/scm/stock-movements`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/scm/stock-movements` | `?productId=` |
| POST | `/api/scm/stock-movements` | productId, quantity, type, reference required; auto-adjusts stock |

Types: `in`, `out`, `adjustment`

---

### CRM — Leads  `/api/crm/leads`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/crm/leads` | `?status=&search=` |
| GET | `/api/crm/leads/:id` | |
| POST | `/api/crm/leads` | fullName, company, email, phone, source required |
| PUT | `/api/crm/leads/:id` | |
| DELETE | `/api/crm/leads/:id` | |
| POST | `/api/crm/leads/:id/convert` | Creates customer, sets lead status to `won` |

Statuses: `new`, `contacted`, `qualified`, `proposal`, `won`, `lost`

---

### CRM — Customers  `/api/crm/customers`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/crm/customers` | `?search=` |
| GET | `/api/crm/customers/:id` | |
| POST | `/api/crm/customers` | name, company, email, phone, address required |
| PUT | `/api/crm/customers/:id` | |
| DELETE | `/api/crm/customers/:id` | |

---

### CRM — Deals  `/api/crm/deals`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/crm/deals` | `?stage=` |
| GET | `/api/crm/deals/:id` | |
| POST | `/api/crm/deals` | title, customerId, amount, ownerId, expectedCloseDate required |
| PUT | `/api/crm/deals/:id` | |
| PATCH | `/api/crm/deals/:id/stage` | `{ stage }` |
| DELETE | `/api/crm/deals/:id` | |

Stages: `open`, `negotiation`, `proposal`, `won`, `lost`

---

### CRM — Activities  `/api/crm/activities`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/crm/activities` | `?relatedEntity=lead&relatedEntityId=1` |
| POST | `/api/crm/activities` | relatedEntity, relatedEntityId, type, description required |

Types: `call`, `meeting`, `note`, `email`

---

### Dashboard  `/api/dashboard/stats`

Returns live aggregated counts from all module services.

---

## Key Workflows

### SCM Workflow
1. Login — `POST /api/auth/login`
2. Create supplier — `POST /api/scm/suppliers`
3. Create product — `POST /api/scm/products`
4. Create purchase request — `POST /api/scm/purchase-requests`
5. Approve request — `PATCH /api/scm/purchase-requests/:id/status` with `{ "status": "approved" }`
6. Record receipt — `POST /api/scm/stock-movements` with `{ "type": "in", ... }`

### CRM Workflow
1. Login — `POST /api/auth/login`
2. Create lead — `POST /api/crm/leads`
3. Qualify lead — `PUT /api/crm/leads/:id` with `{ "status": "qualified" }`
4. Convert — `POST /api/crm/leads/:id/convert`
5. Create deal — `POST /api/crm/deals`
6. Log activity — `POST /api/crm/activities`
7. Close deal — `PATCH /api/crm/deals/:id/stage` with `{ "stage": "won" }`

---

## Architecture Notes

- **Routes → Services** — routes handle HTTP concerns only; services own business logic and in-memory data.
- **Swappable data layer** — replacing in-memory arrays with a Prisma/Knex repository requires changes only inside each service.
- **Consistent response shape** — all endpoints use the `ok()` / `fail()` helpers in `server/utils/response.ts`.
- **Stock auto-update** — `POST /scm/stock-movements` automatically adjusts `product.currentStock` via `productService.adjustStock()`.
- **Lead conversion** — `POST /crm/leads/:id/convert` atomically creates a customer and marks the originating lead as `won`.
- **Live dashboard** — `statsService.getStats()` pulls live counts from every module service at request time rather than caching.
