# Building WardSuite ERP: A Personal Vision for the Business Operating System I Always Wanted

**By Eduardo Manlangit Jr. (wardvisual)**
*Full-Stack Developer · Open Source Builder*

---

![WardSuite Homepage](docs/images/homepage-screenshot-placeholder.png)
*WardSuite landing page — the entry point to the platform*

---

## The Problem I Was Trying to Solve

I've worked with a lot of business software. CRMs that cost thousands per seat. ERPs that take six months to configure. Supply chain tools that don't talk to sales. Analytics dashboards that show you data but don't connect it to anything actionable.

Every time I sat down with a business tool, I had the same thought: *this is solving the wrong problem, or solving the right problem in the wrong way.*

So I started asking myself a different question: **What would I build if I were designing a business operating system from scratch, for myself first?**

WardSuite is the answer to that question.

---

## What is WardSuite?

WardSuite is a modular, open-source ERP (Enterprise Resource Planning) system built on a modern TypeScript stack. It starts with a full-featured CRM and Supply Chain module, but the architecture is explicitly designed to grow into a complete business operating system — HR, payroll, procurement, accounting — everything a real company needs.

It's not a SaaS product (yet). It's a proof of concept, built in public, to show what's possible when you don't compromise on architecture.

---

## The Technical Vision

Before writing a single line of code, I made three non-negotiable architectural decisions.

### 1. Database-Agnostic by Design

I've seen too many codebases that are so tightly coupled to their database that a migration becomes a six-month project. WardSuite uses the **repository pattern** throughout.

Every service codes against an interface, not a concrete implementation:

```typescript
// The contract — database-agnostic
export interface ILeadRepository {
  findAll(): Promise<Lead[]>;
  create(dto: CreateLeadDto, actorId?: string): Promise<Lead>;
  update(id: string, dto: UpdateLeadDto): Promise<Lead>;
  remove(id: string): Promise<void>;
}

// Today: Firestore
export class FirestoreLeadRepository
  extends FirestoreBaseAdapter
  implements ILeadRepository { }

// Tomorrow: Postgres — one line change in the service
const repo = new PostgresLeadRepository(pgClient);
```

Swapping the entire database layer requires changing exactly one line per service. That's the standard I held myself to.

### 2. Monorepo with Real Library Boundaries

WardSuite uses an NX monorepo with genuine library separation — not just folders, but enforced boundaries between domains:

```
libs/
├── crm/domain/          # Entity interfaces + DTOs
├── crm/data-access/     # Repository interfaces + Firestore adapters
├── crm/feature-leads/   # React hooks + page components
└── shared/ui/           # Design system (floating-card, skeleton, modals)
```

Each library has a single public API (`index.ts`). Nothing crosses boundaries except through those contracts. This is how you build something that doesn't turn into a spaghetti codebase as it grows.

### 3. Complete Audit Trail on Every Mutation

In a real business context, you need to know *who changed what, when, and why*. WardSuite automatically logs an audit entry to Firestore on every CRM mutation — creates, updates, deletes, and stage transitions:

```
Lead "Acme Corp" (LD-042) created from source: referral.
Deal "Q3 Renewal" moved from "proposal" → "won".
Customer "TechBase Ltd" updated — status "inactive" → "active".
Lead "John Smith" converted to customer (CUST-018).
```

This isn't bolted on — it's baked into the route layer as a convention.

---

## The Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 19 + Vite 6 | Latest React with concurrent features, fast HMR |
| Styling | Tailwind CSS v4 | Utility-first, consistent design tokens |
| Animations | Motion (Framer Motion v12) | Page transitions, micro-interactions, drag feedback |
| State | Zustand 5 | Lightweight, persisted auth store |
| Backend | Express 4 + TypeScript | Familiar, fast, easy to reason about |
| Database | Firestore | Scalable for early stage, swappable later |
| Monorepo | NX | Task caching, project graph, library boundaries |
| Deployment | Docker + PM2 | VPS-ready, zero-downtime cluster mode |

---

## What I Built

### CRM: The Core Module

![CRM Dashboard](docs/images/crm-dashboard-placeholder.png)
*← Dashboard showing real-time pipeline revenue, conversion rate, and 12-month chart*

The CRM is the heart of WardSuite. Every feature was designed around how sales teams actually work:

**Lead Management**

![Leads Kanban](docs/images/leads-kanban-placeholder.png)
*← Lead kanban board with drag-and-drop status transitions*

Leads flow from *New → Contacted → Qualified → Proposal → Won/Lost*. You can view them as a Kanban board or a sortable table. Bulk import via CSV with a column mapper that lets you drag-and-drop which columns map to which fields.

**Revenue Pipeline**

![Pipeline](docs/images/pipeline-placeholder.png)
*← Deal pipeline with drag-and-drop across five stages*

The Pipeline is a drag-and-drop Kanban board across five stages: Open → Proposal → Negotiation → Won → Lost. Every column shows the total value of deals in that stage. Dropping a card fires a PATCH request, updates the stage, and logs an audit entry — all in a single drag.

**Dashboard with Real Analytics**

The dashboard pulls live data from every module:
- Pipeline revenue (sum of all non-lost deals)
- Won revenue (closed deals only)
- Conversion rate (customers / leads)
- 12-month revenue chart (deals grouped by creation month)

No fake data. No hardcoded numbers.

**Activities & Audit Trail**

![Activity Log](docs/images/activity-log-placeholder.png)
*← Activity log showing system-generated audit entries and manual activities*

Every action is logged automatically. Sales reps can also manually log calls, meetings, notes, and emails against any entity. The system-generated entries and manual entries coexist in a unified timeline.

---

## What I Learned

### On Architecture

**Repository pattern is worth the ceremony.** At first it feels like extra boilerplate — a `findAll()` interface, a `FirestoreXRepository` class, a service that instantiates it. But when you're six months in and need to add a query that Firestore doesn't support efficiently, you add a method to the interface, implement it, and the service doesn't change at all. The upfront investment pays back.

**NX libraries enforce discipline.** Without hard boundaries, everything bleeds into everything. The CRM domain shouldn't know about the UI. The UI components shouldn't import from the API. Having `@wardsuite/crm/domain` as a named package that you import from — rather than a relative path you navigate to — changes how you think about dependencies.

### On Product

**Build what you'd use yourself.** Every feature decision was filtered through the question: *would I actually use this?* The CSV import column mapper, the drag-to-convert pipeline, the audit trail — these exist because I've been frustrated by their absence in real tools.

**Dummy data is dishonest.** Early versions of the dashboard had hardcoded numbers. It looked great in screenshots. But it's useless. I rewired everything to pull from Firestore — and in doing so, I fixed three bugs I didn't know existed (NaN from Firestore number coercion, missing audit entries, hardcoded revenue fields).

### On Building in Public

This is the first project I've committed to building in public. The discipline of writing a `CLAUDE.md` agent guide — documenting every convention, pattern, and decision — forced me to articulate things I'd normally just hold in my head. It made the codebase significantly more coherent.

---

## Where It's Going

WardSuite is a proof of concept, but not a toy. The roadmap is real:

**Phase 1 — CRM Completion (current)**
- Lead scoring, deal probability, bulk operations, advanced filtering
- Revenue forecast view, win/loss reason tracking
- In-app notifications, email integration

**Phase 2 — SCM Depth**
- Vendor RFQ (request for quotation) workflow
- Purchase order lifecycle (draft → approved → received)
- Inventory valuation and COGS tracking

**Phase 3 — Financial Layer**
- Invoicing tied to won deals
- Payment tracking
- Financial reporting (P&L, AR aging)

**Phase 4 — HR Module**
- Employee directory
- Leave management
- Payroll integration

**Phase 5 — AI Layer**
- Lead scoring via Google Gemini
- AI-generated activity summaries
- Deal risk detection (stalled deals, pricing outliers)

---

## Why I'm Sharing This

I built WardSuite because I believe the tools that run businesses shouldn't be black boxes that cost a fortune and lock you in. I wanted to show that you can build something production-grade — with real architecture, real data, real UX — as a solo developer, in public.

If you're a business owner looking at this and thinking *"I could actually use this"* — that's exactly the reaction I was hoping for.

If you're a developer reading this and thinking *"I want to build something like this"* — the code is open, the architecture is documented, and the `CLAUDE.md` file explains every decision I made.

---

## Try It

- **Live demo**: Sign in with `admin@wardsuite.com` / `admin123`
- **Source code**: [github.com/wardvisual](https://github.com/wardvisual)
- **Built by**: Eduardo Manlangit Jr. — [@wardvisual](https://github.com/wardvisual)

---

*This case study was written as both a technical retrospective and a public record of the vision behind WardSuite. Updates will follow as the platform grows.*

*© 2025 Eduardo Manlangit Jr. — MIT License*
