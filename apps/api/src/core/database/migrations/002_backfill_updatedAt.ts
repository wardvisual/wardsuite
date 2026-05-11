import { db } from '../firestore.client';

export const description = 'Backfill missing updatedAt field on all ERP collections';

const COLLECTIONS = [
  'crm_leads',
  'crm_customers',
  'crm_deals',
  'scm_suppliers',
  'scm_products',
  'scm_purchase_requests',
];

export default async function () {
  const fallback = new Date().toISOString();

  for (const name of COLLECTIONS) {
    const snap = await db.collection(name).get();
    const missing = snap.docs.filter(d => !d.data().updatedAt);
    if (!missing.length) continue;

    const batch = db.batch();
    missing.forEach(doc =>
      batch.update(doc.ref, { updatedAt: doc.data().createdAt ?? fallback }),
    );
    await batch.commit();
  }
}
