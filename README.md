# WardSuite ERP

> A modular ERP for growing operations, built in public.

WardSuite is a personal ERP built from frustration with existing tools that are either too expensive, too rigid, or missing the cross-module visibility that operations teams actually need. Starting with CRM and Supply Chain, expanding toward a full business operating system.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-suite.wardvisual.com-red?style=for-the-badge)](https://suite.wardvisual.com)

![WardSuite ERP](https://github.com/wardvisual/wardsuite/blob/main/public/banner.jpg?raw=true)

![WardSuite Demo](https://github.com/wardvisual/wardsuite/blob/main/public/demo.gif?raw=true)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 6, Tailwind CSS v4 |
| Animations | Motion (Framer Motion v12) |
| State | Zustand 5 (persisted) |
| Backend | Express 4, TypeScript, tsx |
| Database | Firestore (Firebase Admin SDK) — repository pattern, swappable |
| Drag & Drop | @hello-pangea/dnd |
| Tables | TanStack Table v8 |
| Monorepo | NX |
| Build | Vite (web) + esbuild (API) |
| Deployment | Docker + PM2 |

---

## Monorepo Structure

```
wardsuite/
├── apps/
│   ├── web/                   # React SPA (Vite + Tailwind)
│   └── api/                   # Express API server
│
├── libs/
│   ├── shared/
│   │   ├── types/             # @wardsuite/shared/types
│   │   ├── utils/             # @wardsuite/shared/utils
│   │   ├── auth/              # @wardsuite/shared/auth (Zustand store)
│   │   └── ui/                # @wardsuite/shared/ui (design system)
│   │
│   └── crm/
│       ├── domain/            # @wardsuite/crm/domain (entities + DTOs)
│       ├── data-access/       # @wardsuite/crm/data-access (repos + adapters)
│       ├── feature-leads/     # @wardsuite/crm/feature-leads
│       ├── feature-customers/ # @wardsuite/crm/feature-customers
│       └── ui/                # @wardsuite/crm/ui
│
├── CLAUDE.md
├── tsconfig.base.json
├── nx.json
├── Dockerfile
├── docker-compose.yml
└── ecosystem.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- Firebase project with Firestore enabled
- Service account key (for Admin SDK)

### 1. Clone and Install

```bash
git clone https://github.com/wardvisual/wardsuite.git
cd wardsuite
npm install
```

### 2. Environment Variables

Create `.env` at the workspace root:

```env
PORT=3000
NODE_ENV=development

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_ID=

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_ID=
```

### 3. Development

```bash
npm run dev        # API (:3000) + Vite (:5173) in parallel
npm run dev:api    # API only
npm run dev:web    # Frontend only (proxies /api → localhost:3000)
```

### 4. Seed Demo Data

```bash
npm run firebase:seed
```

---

## Demo Credentials

| Email | Password | Role |
|---|---|---|
| admin@wardsuite.com | admin123 | ADMIN |
| manager@wardsuite.com | manager123 | MANAGER |
| staff@wardsuite.com | staff123 | STAFF |

---

## Modules

### CRM
| Feature | Status |
|---|---|
| Leads | ✅ Kanban + table, CSV import with column mapper, drag-and-drop status |
| Customers | ✅ Full CRUD, convert from lead |
| Pipeline | ✅ Deal Kanban, drag-and-drop stage transitions, revenue totals per stage |
| Activities | ✅ Timeline log with type filters, automatic audit trail |
| Dashboard | ✅ Live revenue stats, 12-month chart, conversion metrics |

### SCM
| Feature | Status |
|---|---|
| Suppliers | ✅ Supplier management, status tracking |
| Products | ✅ Product catalog with stock levels and reorder alerts |
| Purchase Requests | ✅ Request lifecycle management |
| Stock Movements | ✅ Inbound/outbound inventory tracking |

---

## Roadmap

### CRM
- [x] Lead CRUD with kanban and status pipeline
- [x] Lead-to-customer conversion with audit trail
- [x] Customer full CRUD
- [x] Deal pipeline with drag-and-drop stage management
- [x] Activities/timeline log
- [x] Dashboard with live revenue analytics
- [x] Automatic audit trail on all CRM mutations
- [ ] Lead scoring (Low / Medium / High / Hot)
- [ ] Customer segments / tags
- [ ] Deal probability % and weighted pipeline value
- [ ] Bulk lead import validation and error reporting
- [ ] Lead assignment between team members
- [ ] Deal close date notifications / overdue alerts
- [ ] Full-text search across leads, customers, deals

### Pipeline & Revenue
- [ ] Revenue forecast view
- [ ] Win/loss reason tracking
- [ ] Deal history log
- [ ] Duplicate lead detection on import
- [ ] Customer LTV calculation

### Notifications
- [ ] In-app notifications
- [ ] Email integration (SendGrid / Resend)
- [ ] Activity reminders

### Reporting
- [ ] CRM analytics (conversion funnel, lead source breakdown)
- [ ] Exportable reports (PDF / CSV)
- [ ] Team performance dashboard

### Auth
- [ ] Role-based field visibility
- [ ] Invite by email
- [ ] Password change and session management
- [ ] 2FA (TOTP)

---

## Architecture

### Repository Pattern

Services code against interfaces, not concrete classes. Swapping Firestore for Postgres means implementing the interface — no changes to service code.

```typescript
export interface ILeadRepository {
  findAll(): Promise<Lead[]>;
  create(dto: CreateLeadDto, actorId?: string): Promise<Lead>;
}

// Today
const repo = new FirestoreLeadRepository(db);
// Future
const repo = new PostgresLeadRepository(pgClient);
```

### Audit Trail

Every CRM mutation (create, update, delete, stage change) is logged automatically:

```
Lead "Acme Corp" (LD-042) created from source: referral.
Deal "Q3 Renewal" moved from "proposal" → "won".
Customer "TechBase Ltd" updated — status "inactive" → "active".
```

### Auth Flow

```
POST /api/auth/login → { token, user }
  → stored in Zustand (localStorage persist)
  → injected as Bearer token on every request
  → 401 auto-clears session + redirects to /login
```

---

## Deployment

```bash
# Docker
npm run docker:build
npm run docker:up

# PM2
npm run build
npm run start:pm2
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | API + Vite dev servers in parallel |
| `npm run build` | Build frontend + bundle API |
| `npm run lint` | TypeScript type check |
| `npm run firebase:seed` | Seed Firestore with demo data |
| `npm run docker:up` | Start Docker containers |
| `npm run start:pm2` | Start with PM2 in cluster mode |

---

## Author

**Eduardo** — [@wardvisual](https://github.com/wardvisual)

## License

[MIT](./LICENSE) © 2025 Eduardo
