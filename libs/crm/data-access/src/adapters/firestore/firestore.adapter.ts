import { Firestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

export abstract class FirestoreBaseAdapter {
  constructor(protected readonly db: Firestore) {}

  protected toDate(value: unknown): string {
    if (value instanceof Timestamp) return value.toDate().toISOString();
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'string') return value;
    return new Date().toISOString();
  }

  protected serverTimestamp() {
    return FieldValue.serverTimestamp();
  }

  protected async nextCode(collection: string, prefix: string): Promise<string> {
    const counterRef = this.db.collection('_counters').doc(collection);
    const next = await this.db.runTransaction(async (tx) => {
      const snap = await tx.get(counterRef);
      const current = snap.exists ? (snap.data()?.seq ?? 0) : 0;
      const next = current + 1;
      tx.set(counterRef, { seq: next }, { merge: true });
      return next;
    });
    return `${prefix}-${String(next).padStart(4, '0')}`;
  }
}
