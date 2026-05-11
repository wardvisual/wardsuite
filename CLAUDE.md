# WardSuite ERP — Agent Guide

This file is the source of truth for how to work in this codebase. Read it before making any structural decisions.

---

## Monorepo Structure

```
wardsuitepro/
├── apps/
│   ├── web/            React SPA (Vite + Tailwind)      ← active
│   ├── api/            Express API server               ← active
│   ├── admin/          Admin dashboard                  ← future (.gitkeep)
│   ├── worker/         Background job runner            ← future (.gitkeep)
│   └── mobile/         Mobile app                       ← future (.gitkeep)
│
├── libs/
│   ├── shared/
│   │   ├── types/      Shared TypeScript interfaces     ← @wardsuite/shared/types
│   │   ├── utils/      cn(), formatters                 ← @wardsuite/shared/utils
│   │   ├── auth/       Zustand auth store               ← @wardsuite/shared/auth
│   │   ├── ui/         Design system components         ← @wardsuite/shared/ui
│   │   └── config/     Env accessor                     ← @wardsuite/shared/config
│   │
│   ├── crm/
│   │   ├── domain/         Entity interfaces + DTOs     ← @wardsuite/crm/domain
│   │   ├── data-access/    Repo interfaces + adapters   ← @wardsuite/crm/data-access
│   │   ├── feature-leads/  Leads hooks + pages          ← @wardsuite/crm/feature-leads
│   │   ├── feature-customers/                           ← @wardsuite/crm/feature-customers
│   │   └── ui/             CRM-specific components      ← @wardsuite/crm/ui
│   │
│   ├── accounting/     ← future (.gitkeep)
│   ├── inventory/      ← future (.gitkeep)
│   ├── hr/             ← future (.gitkeep)
│   ├── payroll/        ← future (.gitkeep)
│   └── procurement/    ← future (.gitkeep)
│
├── tools/              Build scripts, generators        ← future (.gitkeep)
├── tsconfig.base.json  Root TS config with all path aliases
├── nx.json             NX workspace and project config
└── CLAUDE.md           ← this file
```

---

## Path Aliases

Always use these — never use `../../` relative imports.

| Alias | Resolves to | Use for |
|---|---|---|
| `@/src/*` | `apps/web/src/*` | Frontend-internal imports |
| `@server/*` | `apps/api/src/*` | API-internal imports |
| `@wardsuite/shared/types` | `libs/shared/types/src/index.ts` | Shared entity types |
| `@wardsuite/shared/utils` | `libs/shared/utils/src/index.ts` | `cn()`, helpers |
| `@wardsuite/shared/auth` | `libs/shared/auth/src/index.ts` | Auth store |
| `@wardsuite/shared/ui` | `libs/shared/ui/src/index.ts` | UI primitives |
| `@wardsuite/crm/domain` | `libs/crm/domain/src/index.ts` | CRM entity types/DTOs |
| `@wardsuite/crm/data-access` | `libs/crm/data-access/src/index.ts` | Repository pattern |
| `@wardsuite/crm/feature-leads` | `libs/crm/feature-leads/src/index.ts` | Leads feature |
| `@wardsuite/crm/feature-customers` | `libs/crm/feature-customers/src/index.ts` | Customers feature |
| `@wardsuite/crm/ui` | `libs/crm/ui/src/index.ts` | CRM UI components |

---

## File Naming Rules

| Layer | Pattern | Example |
|---|---|---|
| API routes | `<entity>.routes.ts` | `leads.routes.ts` |
| API service | `<entity>.service.ts` | `leads.service.ts` |
| API DTOs | `<entity>.dto.ts` | `leads.dto.ts` |
| Domain entity | `<entity>.entity.ts` | `lead.entity.ts` |
| Repository interface | `<entity>.repository.ts` | `lead.repository.ts` |
| Firestore adapter | `<entity>.firestore.repository.ts` | `lead.firestore.repository.ts` |
| React hook | `use<Entity>.ts` | `useLeads.ts` |
| React page | `<Entity>s.tsx` (PascalCase) | `Leads.tsx` |
| React component | `<Name>.tsx` (PascalCase) | `LeadKanban.tsx` |
| API client | `<entity>.api.ts` | `leads.api.ts` |

---

## Adding a New API Route

### 1. Add the domain entity in `libs/crm/domain/src/entities/<entity>.entity.ts`

```typescript
export interface Invoice {
  id: string;
  code: string;
  // ...
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDto { /* ... */ }
export interface UpdateInvoiceDto extends Partial<CreateInvoiceDto> {}
```

Export it from `libs/crm/domain/src/index.ts`.

### 2. Add repository interface in `libs/crm/data-access/src/repositories/<entity>.repository.ts`

```typescript
import { Invoice, CreateInvoiceDto, UpdateInvoiceDto } from '@wardsuite/crm/domain';

export interface IInvoiceRepository {
  findAll(): Promise<Invoice[]>;
  findById(id: string): Promise<Invoice | null>;
  create(dto: CreateInvoiceDto, actorId?: string): Promise<Invoice>;
  update(id: string, dto: UpdateInvoiceDto, actorId?: string): Promise<Invoice>;
  remove(id: string): Promise<void>;
}
```

### 3. Implement the Firestore adapter in `libs/crm/data-access/src/adapters/firestore/<entity>.firestore.repository.ts`

```typescript
import { Firestore } from 'firebase-admin/firestore';
import { FirestoreBaseAdapter } from './firestore.adapter';
import { IInvoiceRepository } from '../../repositories/invoice.repository';
import { Invoice, CreateInvoiceDto, UpdateInvoiceDto } from '@wardsuite/crm/domain';

export class FirestoreInvoiceRepository
  extends FirestoreBaseAdapter
  implements IInvoiceRepository
{
  private readonly col = 'crm_invoices';

  constructor(db: Firestore) { super(db); }

  async findAll() { /* ... */ }
  async findById(id: string) { /* ... */ }
  async create(dto: CreateInvoiceDto, actorId = 'system') { /* ... */ }
  async update(id: string, dto: UpdateInvoiceDto) { /* ... */ }
  async remove(id: string) { /* ... */ }
}
```

Export from `libs/crm/data-access/src/index.ts`.

### 4. Add DTOs in `apps/api/src/modules/crm/invoices/invoices.dto.ts`

```typescript
import { z } from 'zod';

export const CreateInvoiceSchema = z.object({
  // ...
});

export type CreateInvoiceDto = z.infer<typeof CreateInvoiceSchema>;
```

### 5. Add service in `apps/api/src/modules/crm/invoices/invoices.service.ts`

```typescript
import { db } from '@server/core/database/firestore.client';
import { FirestoreInvoiceRepository } from '@wardsuite/crm/data-access';

const repo = new FirestoreInvoiceRepository(db);

class InvoiceService {
  list()                             { return repo.findAll(); }
  getById(id: string)                { return repo.findById(id); }
  create(dto, actorId: string)       { return repo.create(dto, actorId); }
  update(id, dto, actorId: string)   { return repo.update(id, dto, actorId); }
  remove(id: string)                 { return repo.remove(id); }
}

export const invoiceService = new InvoiceService();
```

### 6. Add routes in `apps/api/src/modules/crm/invoices/invoices.routes.ts`

Always log an audit entry after state-changing operations (see Audit Trail section below).

```typescript
import { Router } from 'express';
import { invoiceService } from './invoices.service';
import { activitiesService } from '@server/modules/crm/activities/activities.service';
import { requireAuth, resolveActor } from '@server/core/middleware/auth.middleware';
import { ok, fail } from '@server/core/utils/response';

const router = Router();

router.get('/',    requireAuth, async (req, res) => {
  res.json(ok(await invoiceService.list()));
});
router.post('/',   requireAuth, async (req, res) => {
  const item = await invoiceService.create(req.body, resolveActor(req));
  await activitiesService.logAudit({
    relatedEntity: 'invoice',
    relatedEntityId: item.id,
    action: 'created',
    actorId: resolveActor(req),
    summary: `Invoice "${item.code}" created.`,
  });
  res.json(ok(item));
});
router.put('/:id', requireAuth, async (req, res) => {
  const item = await invoiceService.update(req.params.id, req.body, resolveActor(req));
  await activitiesService.logAudit({
    relatedEntity: 'invoice',
    relatedEntityId: req.params.id,
    action: 'updated',
    actorId: resolveActor(req),
    summary: `Invoice updated.`,
  });
  res.json(ok(item));
});
router.delete('/:id', requireAuth, async (req, res) => {
  await invoiceService.remove(req.params.id);
  await activitiesService.logAudit({
    relatedEntity: 'invoice',
    relatedEntityId: req.params.id,
    action: 'deleted',
    actorId: resolveActor(req),
    summary: `Invoice deleted.`,
  });
  res.json(ok(null, 'Deleted'));
});

export default router;
```

### 7. Register in `apps/api/src/routes.ts`

```typescript
import invoicesRouter from './modules/crm/invoices/invoices.routes';
router.use('/crm/invoices', invoicesRouter);
```

---

## Audit Trail

Every state-changing operation (create, update, delete, stage change) **must** log an audit activity via `activitiesService.logAudit()`.

```typescript
import { activitiesService } from '@server/modules/crm/activities/activities.service';

await activitiesService.logAudit({
  relatedEntity: 'deal',           // entity type: 'lead' | 'deal' | 'customer' | 'invoice' | ...
  relatedEntityId: item.id,        // the document ID
  action: 'created',               // 'created' | 'updated' | 'deleted' | 'converted' | 'stage_changed'
  actorId: resolveActor(req),      // from auth middleware
  summary: `Deal "Q3 Renewal" (DEAL-004) created — $12,000 at stage "open".`,
});
```

**Rules:**
- Always include `relatedEntity` — do not omit it (defaults to `'system'` which is wrong).
- Include before/after values in the `summary` string when meaningful: `"status 'new' → 'qualified'"`.
- Log the audit **after** the write succeeds, not before.
- Do not log audits for GET (read) operations.

The audit log is stored in the `crm_activities` Firestore collection with `type: 'audit'` and is surfaced in the Activity Logs page.

---

## Users / Profile Module

User profile overrides (name, timezone, language, currency) are stored in Firestore `users/{userId}` and merged with the in-memory demo user at runtime.

```
apps/api/src/modules/users/
├── users.service.ts     ← Firestore read/write for users/{id}
└── users.routes.ts      ← GET /api/users/me  +  PUT /api/users/me
```

Frontend:

```typescript
// apps/web/src/services/users.api.ts
import { apiClient } from './api.client';

export const usersApi = {
  me: () => apiClient.get<UserProfile>('/users/me'),
  updateMe: (payload) => apiClient.put<UserProfile>('/users/me', payload),
};
```

Settings page pattern — controlled form, save on button click, update auth store:

```typescript
const handleSave = async () => {
  const res = await usersApi.updateMe({ name, timezone, language, currency });
  if (user && token) setAuth({ ...user, name: res.data.name }, token);
};
```

---

## Adding a New Frontend Component

### Rules
- **Max 400 lines per file.** Split into sub-components if a file exceeds 400 lines.
- Use `@/src/*` imports, never relative `../../`.
- All UI primitives come from `@wardsuite/shared/ui`.
- CRM-specific components live in `apps/web/src/components/crm/` or `libs/crm/ui/src/`.
- Page-level modules live in `apps/web/src/modules/<domain>/`.

### Structure for a new feature page

```
apps/web/src/
├── modules/crm/
│   └── Invoices.tsx          ← page (< 400 lines)
├── components/crm/
│   ├── InvoiceForm.tsx       ← form component
│   ├── InvoiceCard.tsx       ← card/row component
│   └── invoices/
│       ├── InvoiceColumns.tsx  ← table column defs
│       └── InvoiceFilters.tsx  ← filter bar
├── hooks/crm/
│   └── useInvoices.ts        ← state + API hook
└── services/crm/
    └── invoices.api.ts       ← REST client
```

### Hook pattern

```typescript
// apps/web/src/hooks/crm/useInvoices.ts
import { useState, useEffect, useCallback } from 'react';
import { invoicesApi } from '@/src/services/crm/invoices.api';
import { Invoice } from '@/src/types';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await invoicesApi.list();
      setInvoices(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { invoices, loading, saving, error, fetch };
}
```

### API service pattern

```typescript
// apps/web/src/services/crm/invoices.api.ts
import { apiClient } from '@/src/services/api.client';
import { Invoice } from '@/src/types';

export const invoicesApi = {
  list:   ()              => apiClient.get<Invoice[]>('/crm/invoices'),
  getById:(id: string)    => apiClient.get<Invoice>(`/crm/invoices/${id}`),
  create: (body: unknown) => apiClient.post<Invoice>('/crm/invoices', body),
  update: (id: string, body: unknown) => apiClient.put<Invoice>(`/crm/invoices/${id}`, body),
  remove: (id: string)    => apiClient.delete<null>(`/crm/invoices/${id}`),
};
```

---

## Number & Currency Safety

Firestore stores numbers as-is, but incoming HTTP bodies may carry string values. Always coerce numeric fields in both the API service layer and the frontend.

**API (service layer):**
```typescript
// In toDeal() or any mapping function
amount: Number(data.amount ?? 0)

// In create/update
amount: Number(dto.amount ?? 0)
```

**Frontend (display):**
```typescript
// Use a consistent formatter for currency values
const fmtK = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;

// When summing, always coerce
const total = deals.reduce((sum, d) => sum + Number(d.amount ?? 0), 0);
```

Never display a raw Firestore field as currency without `Number()` coercion — this is the root cause of NaN in stat cards and pipeline totals.

---

## Dashboard Stats Pattern

The dashboard service aggregates live data from all modules using `Promise.all`. Each service must expose the required count/aggregate methods.

```typescript
// apps/api/src/modules/dashboard/dashboard.service.ts
const [totalLeads, openDeals, pipelineRevenue, wonRevenue, monthlyRevenue] = await Promise.all([
  leadsService.count(),
  dealsService.countOpen(),
  dealsService.pipelineRevenue(),    // sum of all non-lost deals
  dealsService.wonRevenue(),         // sum of won deals only
  dealsService.monthlyRevenue(),     // number[12] — current month is index 11
]);
```

The `monthlyRevenue` array maps to the Revenue Dynamics bar chart. Index 0 = 11 months ago, index 11 = current month.

Frontend receives this via `useDashboardStats` → `apiClient.get('/dashboard/stats')` and uses it to render real bars:

```typescript
const maxVal = Math.max(...monthlyRevenue, 1);
const bars = monthlyRevenue.map(v => Math.max(Math.round((v / maxVal) * 85), 5));
```

---

## Database Adapter (Repository Pattern)

### Why
Services code against **interfaces** (`ILeadRepository`), not concrete classes. Swapping Firestore for Postgres means only implementing the interface — zero changes to service code.

### Current adapters
- `FirestoreLeadRepository` → `libs/crm/data-access/src/adapters/firestore/`
- `FirestoreCustomerRepository`
- `FirestoreDealRepository`
- `FirestoreActivityRepository`

### Adding a new database adapter (e.g. Postgres)

1. Create `libs/crm/data-access/src/adapters/postgres/lead.postgres.repository.ts`
2. Implement `ILeadRepository` using `pg` or Drizzle
3. In `apps/api/src/modules/crm/leads/leads.service.ts`, swap:
   ```typescript
   // Before
   const repo = new FirestoreLeadRepository(db);
   // After
   const repo = new PostgresLeadRepository(pgClient);
   ```

No other code changes needed.

---

## Component Size Limit (400 lines)

If a component exceeds 400 lines, split it:

```
Leads.tsx (400 lines max)
  ↓ extract
├── leads/LeadColumns.tsx       table column definitions
├── leads/LeadForm.tsx          create/edit form
├── leads/LeadImportDrawer.tsx  CSV import flow
└── LeadKanban.tsx              kanban board
```

**Rule:** One file = one primary concern. Forms, columns, drawers, and kanban boards are separate concerns.

---

## Skeleton Loading

Use skeleton components from `@wardsuite/shared/ui` or `@/src/components/ui/Skeleton`:

```typescript
import { ListPageSkeleton, KanbanPageSkeleton } from '@wardsuite/shared/ui';

if (loading) return <ListPageSkeleton />;   // for table pages
if (loading) return <KanbanPageSkeleton />; // for kanban pages
```

---

## Auth

- Auth state lives in `useAuthStore` (`@wardsuite/shared/auth`).
- All protected routes are wrapped in `<AuthGuard>` in `apps/web/src/App.tsx`.
- API requests automatically include `Bearer <token>` from `apps/web/src/services/api.client.ts`.
- 401 responses clear the session and redirect to `/login`.
- Server routes that require auth use `requireAuth` from `@server/core/middleware/auth.middleware`.
- Actor ID is resolved via `resolveActor(req)` — use this in all audit log calls.

Demo accounts (see `apps/api/src/modules/auth/auth.service.ts`):
- `admin@wardsuite.com` / `admin123`
- `manager@wardsuite.com` / `manager123`
- `staff@wardsuite.com` / `staff123`

---

## Adding a New Module (e.g. Accounting)

1. Remove `libs/accounting/.gitkeep`
2. Create:
   - `libs/accounting/domain/src/` — entity interfaces
   - `libs/accounting/data-access/src/` — repo interfaces + Firestore adapters
   - `libs/accounting/feature-invoices/src/` — React hooks + pages
   - `libs/accounting/ui/src/` — accounting-specific components
3. Add path aliases in `tsconfig.base.json`
4. Register in `nx.json`
5. Add API routes in `apps/api/src/modules/accounting/`
6. Add routes in `apps/api/src/routes.ts`
7. Add pages in `apps/web/src/modules/accounting/`
8. Add routes in `apps/web/src/App.tsx`
9. Add nav links in `apps/web/src/components/layout/Sidebar.tsx`

---

## Deployment

```bash
# Local dev — API (:3000) + Vite (:5173) in parallel with labeled output
npm run dev

# API only
npm run dev:api

# Frontend only (Vite with /api proxy to localhost:3000)
npm run dev:web

# Build both apps
npm run build

# Production (PM2 cluster mode)
npm run start:pm2

# Docker
npm run docker:up
```

Environment variables live at the **workspace root** `.env`. Vite reads `VITE_*` vars via `envDir` set to workspace root in `apps/web/vite.config.ts`. The API reads all vars via `dotenv/config`.

---

## Git Workflow

**The agent does not commit.** After making changes, output the exact `git add` and `git commit` commands for the developer to run manually. The developer (@wardvisual) is the sole author of all commits.

### Rules
- **Never run `git commit` yourself.** Always hand the commands to the developer.
- **No Co-Authored-By lines.** Commits are authored by wardvisual only — do not add `Co-Authored-By: Claude` or any AI attribution.
- **One commit per logical change.** Group related files; don't suggest `git add .` or `git add -A`.
- **Conventional commit format** — `type(scope): description` where type is one of: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `test`.

### Commit message format

```
feat(web/crm): add invoice list page with sortable table

- InvoiceColumns.tsx: TanStack Table column definitions
- useInvoices.ts: fetch hook with loading/error state
- invoices.api.ts: REST client for /crm/invoices
```

### Example output after changes

After completing work, output commands like this:

```bash
git add apps/web/src/modules/CaseStudy.tsx apps/web/src/App.tsx
git commit -m "feat(web): add public Case Study page at /case-study"

git add apps/web/src/components/ui/Logo.tsx
git commit -m "feat(web/ui): add reusable Logo component with size variants"
```

The developer reviews, adjusts if needed, and runs the commands themselves.
