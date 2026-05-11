import 'dotenv/config';
import { db } from './firestore.client';

async function resetCounter(name: string, value: number) {
  await db.collection('_counters').doc(name).set({ count: value });
}

async function seedCollection(
  collectionName: string,
  docs: Record<string, unknown>[],
  counterName?: string,
) {
  const col = db.collection(collectionName);
  const existing = await col.limit(1).get();
  if (!existing.empty) {
    console.log(`  [skip] ${collectionName} already has data`);
    return;
  }

  const batch = db.batch();
  for (const doc of docs) {
    batch.set(col.doc(), doc);
  }
  await batch.commit();

  if (counterName) {
    await resetCounter(counterName, docs.length);
  }

  console.log(`  [seed] ${collectionName} — ${docs.length} document(s) inserted`);
}

const now = new Date().toISOString();

async function main() {
  console.log('[WardSuite] Seeding Firestore...\n');

  await seedCollection(
    'scm_suppliers',
    [
      {
        code: 'SUP-001',
        name: 'Global Tech Supplies',
        email: 'orders@globaltech.com',
        phone: '+1-555-0100',
        address: '123 Industrial Ave, Chicago, IL',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'SUP-002',
        name: 'Pacific Rim Components',
        email: 'sales@pacificrim.co',
        phone: '+63-2-555-0200',
        address: '88 Makati Ave, Manila, PH',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
    ],
    'scm_suppliers',
  );

  await seedCollection(
    'scm_products',
    [
      {
        code: 'PRD-001',
        name: 'Laptop Pro 15"',
        sku: 'LPT-PRO-15',
        category: 'Electronics',
        unitPrice: 1299.99,
        stockQty: 45,
        reorderLevel: 10,
        supplierId: 'SUP-001',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'PRD-002',
        name: 'Wireless Keyboard',
        sku: 'WKB-001',
        category: 'Peripherals',
        unitPrice: 79.99,
        stockQty: 120,
        reorderLevel: 20,
        supplierId: 'SUP-001',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'PRD-003',
        name: 'USB-C Hub 7-in-1',
        sku: 'UCH-7IN1',
        category: 'Accessories',
        unitPrice: 49.99,
        stockQty: 8,
        reorderLevel: 15,
        supplierId: 'SUP-002',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
    ],
    'scm_products',
  );

  await seedCollection(
    'crm_leads',
    [
      {
        code: 'LD-001',
        name: 'Alice Johnson',
        company: 'TechCorp Inc.',
        email: 'alice@techcorp.com',
        phone: '+1-555-0301',
        status: 'new',
        source: 'website',
        notes: 'Interested in enterprise plan',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'LD-002',
        name: 'Bob Martinez',
        company: 'StartupXYZ',
        email: 'bob@startupxyz.io',
        phone: '+1-555-0302',
        status: 'contacted',
        source: 'referral',
        notes: 'Follow up after product demo',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'LD-003',
        name: 'Carol White',
        company: 'Acme Ltd.',
        email: 'carol@acme.com',
        phone: '+44-20-5550303',
        status: 'qualified',
        source: 'linkedin',
        notes: 'Ready for proposal',
        createdAt: now,
        updatedAt: now,
      },
    ],
    'crm_leads',
  );

  await seedCollection(
    'crm_customers',
    [
      {
        code: 'CUST-001',
        name: 'David Chen',
        company: 'Nexus Systems',
        email: 'david@nexussys.com',
        phone: '+1-555-0401',
        address: '456 Tech Blvd, San Francisco, CA',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
    ],
    'crm_customers',
  );

  await seedCollection(
    'crm_deals',
    [
      {
        code: 'DEAL-001',
        title: 'Nexus Systems — Enterprise License',
        customerId: 'CUST-001',
        value: 24000,
        stage: 'proposal',
        probability: 60,
        expectedCloseDate: '2026-06-30',
        notes: 'Annual subscription, 50 seats',
        createdAt: now,
        updatedAt: now,
      },
    ],
    'crm_deals',
  );

  console.log('\n[WardSuite] Seed complete.');
}

main().catch((err) => {
  console.error('[WardSuite] Seed failed:', err);
  process.exit(1);
});
