import { db } from '@server/core/database/firestore.client';

const COLLECTION = 'users';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  timezone?: string;
  language?: string;
  currency?: string;
  updatedAt: string;
}

class UsersService {
  private col = db.collection(COLLECTION);

  async getProfile(userId: string): Promise<UserProfile | null> {
    const doc = await this.col.doc(userId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as UserProfile;
  }

  async upsertProfile(userId: string, data: Partial<Omit<UserProfile, 'id' | 'updatedAt'>>): Promise<UserProfile> {
    const now = new Date().toISOString();
    await this.col.doc(userId).set({ ...data, updatedAt: now }, { merge: true });
    const doc = await this.col.doc(userId).get();
    return { id: doc.id, ...doc.data() } as UserProfile;
  }
}

export const usersService = new UsersService();
