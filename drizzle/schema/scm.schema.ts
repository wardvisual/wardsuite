import {
  mysqlTable, varchar, text, decimal, int, timestamp, index, mysqlEnum, json,
} from 'drizzle-orm/mysql-core';

// ─── Suppliers ────────────────────────────────────────────────────────────────

export const suppliers = mysqlTable('suppliers', {
  id:            varchar('id', { length: 36 }).primaryKey(),
  code:          varchar('code', { length: 20 }).notNull().unique(),
  name:          varchar('name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }).notNull(),
  email:         varchar('email', { length: 255 }).notNull(),
  phone:         varchar('phone', { length: 50 }).notNull(),
  address:       text('address').notNull(),
  status:        mysqlEnum('status', ['active', 'inactive']).notNull().default('active'),
  notes:         text('notes'),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── Products ─────────────────────────────────────────────────────────────────

export const products = mysqlTable('products', {
  id:           varchar('id', { length: 36 }).primaryKey(),
  sku:          varchar('sku', { length: 50 }).notNull().unique(),
  name:         varchar('name', { length: 255 }).notNull(),
  category:     varchar('category', { length: 100 }).notNull(),
  unit:         varchar('unit', { length: 50 }).notNull(),
  costPrice:    decimal('cost_price', { precision: 15, scale: 2 }).notNull(),
  sellingPrice: decimal('selling_price', { precision: 15, scale: 2 }).notNull(),
  currentStock: int('current_stock').notNull().default(0),
  reorderLevel: int('reorder_level').notNull().default(0),
  status:       mysqlEnum('status', ['active', 'inactive']).notNull().default('active'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, t => ({
  categoryIdx: index('products_category_idx').on(t.category),
}));

// ─── Purchase Requests ────────────────────────────────────────────────────────

export const purchaseRequests = mysqlTable('purchase_requests', {
  id:             varchar('id', { length: 36 }).primaryKey(),
  requestNumber:  varchar('request_number', { length: 20 }).notNull().unique(),
  requestDate:    timestamp('request_date').defaultNow().notNull(),
  supplierId:     varchar('supplier_id', { length: 36 }).notNull(),
  requestedById:  varchar('requested_by_id', { length: 36 }).notNull(),
  status:         mysqlEnum('status', ['draft', 'submitted', 'approved', 'rejected', 'ordered', 'received']).notNull().default('draft'),
  notes:          text('notes'),
  // Line items stored as JSON for PoC simplicity — normalise to purchase_request_items in production
  items:          json('items').notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
  updatedAt:      timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, t => ({
  statusIdx: index('pr_status_idx').on(t.status),
}));

// ─── Stock Movements ──────────────────────────────────────────────────────────

export const stockMovements = mysqlTable('stock_movements', {
  id:        varchar('id', { length: 36 }).primaryKey(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  quantity:  int('quantity').notNull(),
  type:      mysqlEnum('type', ['in', 'out', 'adjustment']).notNull(),
  reference: varchar('reference', { length: 100 }).notNull(),
  date:      timestamp('date').defaultNow().notNull(),
  notes:     text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, t => ({
  productIdx: index('stock_movements_product_idx').on(t.productId),
}));
