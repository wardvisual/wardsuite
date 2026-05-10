import {
  mysqlTable, varchar, text, decimal, timestamp, index, mysqlEnum,
} from 'drizzle-orm/mysql-core';

// ─── Leads ────────────────────────────────────────────────────────────────────

export const leads = mysqlTable('leads', {
  id:             varchar('id', { length: 36 }).primaryKey(),
  code:           varchar('code', { length: 20 }).notNull().unique(),
  fullName:       varchar('full_name', { length: 255 }).notNull(),
  company:        varchar('company', { length: 255 }).notNull(),
  email:          varchar('email', { length: 255 }).notNull(),
  phone:          varchar('phone', { length: 50 }).notNull(),
  source:         varchar('source', { length: 100 }).notNull(),
  status:         mysqlEnum('status', ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']).notNull().default('new'),
  assignedUserId: varchar('assigned_user_id', { length: 36 }),
  notes:          text('notes'),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
  updatedAt:      timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, t => ({
  statusIdx: index('leads_status_idx').on(t.status),
  emailIdx:  index('leads_email_idx').on(t.email),
}));

// ─── Customers ────────────────────────────────────────────────────────────────

export const customers = mysqlTable('customers', {
  id:               varchar('id', { length: 36 }).primaryKey(),
  code:             varchar('code', { length: 20 }).notNull().unique(),
  name:             varchar('name', { length: 255 }).notNull(),
  company:          varchar('company', { length: 255 }).notNull(),
  email:            varchar('email', { length: 255 }).notNull(),
  phone:            varchar('phone', { length: 50 }).notNull(),
  address:          text('address').notNull(),
  accountManagerId: varchar('account_manager_id', { length: 36 }),
  status:           mysqlEnum('status', ['active', 'inactive']).notNull().default('active'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, t => ({
  emailIdx: index('customers_email_idx').on(t.email),
}));

// ─── Deals ────────────────────────────────────────────────────────────────────

export const deals = mysqlTable('deals', {
  id:                varchar('id', { length: 36 }).primaryKey(),
  code:              varchar('code', { length: 20 }).notNull().unique(),
  title:             varchar('title', { length: 255 }).notNull(),
  customerId:        varchar('customer_id', { length: 36 }).notNull(),
  leadId:            varchar('lead_id', { length: 36 }),
  amount:            decimal('amount', { precision: 15, scale: 2 }).notNull(),
  stage:             mysqlEnum('stage', ['open', 'negotiation', 'proposal', 'won', 'lost']).notNull().default('open'),
  ownerId:           varchar('owner_id', { length: 36 }).notNull(),
  expectedCloseDate: varchar('expected_close_date', { length: 20 }).notNull(),
  notes:             text('notes'),
  createdAt:         timestamp('created_at').defaultNow().notNull(),
  updatedAt:         timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, t => ({
  stageIdx:      index('deals_stage_idx').on(t.stage),
  customerIdx:   index('deals_customer_idx').on(t.customerId),
}));

// ─── Activities ───────────────────────────────────────────────────────────────

export const activities = mysqlTable('activities', {
  id:              varchar('id', { length: 36 }).primaryKey(),
  relatedEntity:   varchar('related_entity', { length: 50 }).notNull(),
  relatedEntityId: varchar('related_entity_id', { length: 36 }).notNull(),
  type:            mysqlEnum('type', ['call', 'meeting', 'note', 'email', 'audit']).notNull(),
  description:     text('description').notNull(),
  createdBy:       varchar('created_by', { length: 36 }).notNull(),
  createdAt:       timestamp('created_at').defaultNow().notNull(),
}, t => ({
  entityIdx: index('activities_entity_idx').on(t.relatedEntity, t.relatedEntityId),
}));
