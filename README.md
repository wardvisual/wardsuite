# WardSuite ERP

> A modular ERP for growing operations, built in public.

WardSuite is a modular Enterprise Resource Planning platform designed from personal experience with the gaps left by existing business software. My main focus is building a practical, connected system for growing operations — starting with CRM and Supply Chain, expanding into a full business operating system.

![WardSuite ERP](https://raw.githubusercontent.com/wardvisual/wardsuite/refs/heads/main/public/banner.jpg?token=GHSAT0AAAAAACMTPIR2IDRJFBIJ3K2UMPQK2QBTSVQ)

---

## Vision

Most ERP systems are either too expensive, too rigid, or too generic. WardSuite is built with a clear technical vision:

- **Database-agnostic** — repository pattern throughout; swap Firestore for Postgres with one line
- **Modular by design** — each business domain is a standalone NX library
- **Built in public** — fully open source, documented, and meant to be learned from
- **Production-ready patterns** — auth, audit trail, role-based access, skeleton loading, drag-and-drop

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19, Vite 6, Tailwind CSS v4 | SPA with HMR, path aliases |
| Animations | Motion (Framer Motion v12) | Page transitions, micro-interactions |
| State | Zustand 5 (persisted) | Auth store, per-module hooks |
| Backend | Express 4, TypeScript, tsx | Pure API server, NX workspace |
| Database | Firestore (Firebase Admin SDK) | Repository pattern — swappable |
| Auth | Token-based sessions | In-memory demo; swap for JWT/Redis |
| Drag & Drop | @hello-pangea/dnd | Pipeline Kanban board |
| Tables | TanStack Table v8 | Sortable, filterable data tables |
| Monorepo | NX | Project graph, task caching |
| Build | Vite (web) + esbuild (API) | Optimized production bundles |
| Deployment | Docker + PM2 | Multi-stage build, cluster mode |
| AI | Google Gemini SDK | Future: lead scoring, summaries |

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
│   │   ├── utils/             # @wardsuite/shared/utils  (cn, formatters)
│   │   ├── auth/              # @wardsuite/shared/auth   (Zustand store)
│   │   └── ui/                # @wardsuite/shared/ui     (design system)
│   │
│   └── crm/
│       ├── domain/            # @wardsuite/crm/domain    (entities + DTOs)
│       ├── data-access/       # @wardsuite/crm/data-access (repos + adapters)
│       ├── feature-leads/     # @wardsuite/crm/feature-leads
│       ├── feature-customers/ # @wardsuite/crm/feature-customers
│       └── ui/                # @wardsuite/crm/ui
│
├── CLAUDE.md                  # AI agent guide (architecture, patterns, conventions)
├── tsconfig.base.json         # Root TS config with all path aliases
├── nx.json                    # NX workspace project graph
├── Dockerfile                 # Multi-stage build (builder → runner, Node 22 Alpine)
├── docker-compose.yml         # VPS deployment
└── ecosystem.config.js        # PM2 cluster config
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
# ─── App ──────────────────────────────────────────────────────────────
PORT=3000
NODE_ENV=development

# ─── Firebase Admin SDK (Server) ──────────────────────────────────────
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_ID=           # leave blank for (default) database

# ─── Firebase Web Client SDK (Frontend, VITE_ prefix required) ────────
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
# Start both API (:3000) and Vite dev server (:5173) with labeled output
npm run dev

# API only
npm run dev:api

# Frontend only (proxies /api → localhost:3000)
npm run dev:web
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

### CRM (Customer Relationship Management)
| Feature | Status | Description |
|---|---|---|
| Leads | ✅ Live | Kanban + table, CSV import with column mapper, status drag-and-drop |
| Customers | ✅ Live | Full CRUD, customer cards, convert from lead |
| Pipeline | ✅ Live | Deal Kanban, drag-and-drop stage transitions, revenue totals |
| Activities | ✅ Live | Timeline log with type filters, automatic audit trail |
| Dashboard | ✅ Live | Real-time revenue stats, 12-month chart, conversion metrics |

### SCM (Supply Chain Management)
| Feature | Status | Description |
|---|---|---|
| Suppliers | ✅ Live | Supplier management, status tracking |
| Products | ✅ Live | Product catalog with stock levels and reorder alerts |
| Purchase Requests | ✅ Live | Request lifecycle management |
| Stock Movements | ✅ Live | Inbound/outbound inventory tracking |

---

## CRM Roadmap

The following checklist defines what needs to be completed to make CRM fully functional as a production business tool.

### Core CRM
- [x] Lead CRUD with kanban board and status pipeline
- [x] Lead-to-customer conversion with audit trail
- [x] Customer full CRUD
- [x] Deal pipeline with drag-and-drop stage management
- [x] Activities/timeline log (call, meeting, note, email, audit)
- [x] Dashboard with real revenue analytics (pipeline, won, monthly chart)
- [x] Automatic audit trail on all CRM mutations
- [ ] Lead scoring (manual priority levels: Low / Medium / High / Hot)
- [ ] Customer segments / tags for filtering
- [ ] Deal probability % field and weighted pipeline value
- [ ] Bulk lead import validation and error reporting
- [ ] Lead assignment and reassignment between team members
- [ ] Deal expected close date notifications / overdue alerts
- [ ] CRM search with full-text across leads, customers, and deals

### Pipeline & Revenue
- [ ] Revenue forecast view (by month, by rep, by stage)
- [ ] Win/loss reason tracking on deal closure
- [ ] Deal history log (all stage changes with timestamps)
- [ ] Duplicate lead detection on import
- [ ] Customer lifetime value (LTV) calculation

### Collaboration & Notifications
- [ ] In-app notifications (new lead assigned, deal stage changed)
- [ ] Email notification integration (SendGrid / Resend)
- [ ] Mentions in activity notes (@user)
- [ ] Activity reminders and follow-up scheduling

### Reporting
- [ ] CRM analytics page (conversion funnel, lead source breakdown)
- [ ] Exportable reports (PDF / CSV) for leads, deals, revenue
- [ ] Team performance dashboard (deals per rep, conversion rate)
- [ ] Pipeline velocity metrics

### Data & Integrations
- [ ] Calendar integration (Google Calendar, scheduling follow-ups)
- [ ] Email sync (link sent/received emails to leads and deals)
- [ ] Zapier / webhook outbound for CRM events
- [ ] AI-powered lead scoring via Gemini (rank leads by conversion probability)
- [ ] AI-generated activity summaries

### Auth & Access Control
- [ ] Role-based field visibility (STAFF cannot see deal amounts)
- [ ] Invite team members by email
- [ ] Password change and session management
- [ ] 2FA (TOTP)

---

## Architecture Highlights

### Repository Pattern (Database-Agnostic)

Services code against interfaces, not concrete implementations:

```typescript
// Interface in libs/crm/data-access/src/repositories/
export interface ILeadRepository {
  findAll(): Promise<Lead[]>;
  create(dto: CreateLeadDto, actorId?: string): Promise<Lead>;
  // ...
}

// Firestore implementation
export class FirestoreLeadRepository extends FirestoreBaseAdapter implements ILeadRepository { }

// In app service — swap adapter without changing service code
const repo = new FirestoreLeadRepository(db);     // today
const repo = new PostgresLeadRepository(client);   // future
```

### Audit Trail

Every CRM mutation is automatically logged to `crm_activities` with actor, entity, action, and a human-readable summary:

```
Lead "Acme Corp" (LD-042) created from source: referral.
Deal "Q3 Renewal" moved from "proposal" → "won".
Customer "TechBase Ltd" updated — status "inactive" → "active".
```

### Auth Flow

```
POST /api/auth/login → { token, user }
  → stored in Zustand (localStorage persist)
  → injected as Bearer token on every request (api.client.ts)
  → 401 auto-clears session + redirects to /login
```

---

## Production Deployment

### Docker (recommended)

```bash
npm run docker:build
npm run docker:up
npm run docker:logs
```

### PM2 (direct on VPS)

```bash
npm run build
npm run start:pm2
npm run logs:pm2
```

---

## Scripts Reference

| Script | Description |
|---|---|
| `npm run dev` | API + Vite dev servers in parallel (color-coded) |
| `npm run dev:api` | API server only on :3000 |
| `npm run dev:web` | Vite dev server only on :5173 |
| `npm run build` | Build frontend (Vite) + bundle API (esbuild) |
| `npm run lint` | TypeScript type check |
| `npm run firebase:seed` | Seed Firestore with demo data |
| `npm run firebase:migrate` | Run pending Firestore migrations |
| `npm run firebase:rules` | Deploy Firestore security rules |
| `npm run docker:up` | Start Docker containers (detached) |
| `npm run start:pm2` | Start with PM2 in cluster mode |

---

## Author

**Eduardo.** — [@wardvisual](https://github.com/wardvisual)

> *"I tried different ERP and CRM applications and none of them quite fit. So I built my own — in public."*

This project is a personal proof of concept and a statement of technical intent. The goal is to build something real, not just a demo — an ERP I can actually use and show to businesses.

---

## License

[MIT](./LICENSE) © 2025 Eduardo.
