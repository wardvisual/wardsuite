import { db } from '../firestore.client';

export const description = 'Backfill missing source field on crm_leads to "unknown"';

export default async function () {
  const snap = await db.collection('crm_leads').get();
  const missing = snap.docs.filter(d => !d.data().source);
  if (!missing.length) return;

  const batch = db.batch();
  missing.forEach(doc => batch.update(doc.ref, { source: 'unknown' }));
  await batch.commit();
}
