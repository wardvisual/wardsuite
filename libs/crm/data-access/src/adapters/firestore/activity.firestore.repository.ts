import { Firestore } from 'firebase-admin/firestore';
import { FirestoreBaseAdapter } from './firestore.adapter';
import { IActivityRepository, ActivityFilter } from '../../repositories/activity.repository';
import { Activity, CreateActivityDto } from '@wardsuite/crm/domain';

export class FirestoreActivityRepository
  extends FirestoreBaseAdapter
  implements IActivityRepository
{
  private readonly col = 'crm_activities';

  constructor(db: Firestore) {
    super(db);
  }

  async findAll(filter?: ActivityFilter): Promise<Activity[]> {
    let q = this.db.collection(this.col).orderBy('createdAt', 'desc') as FirebaseFirestore.Query;
    if (filter?.relatedEntity) q = q.where('relatedEntity', '==', filter.relatedEntity);
    if (filter?.relatedEntityId) q = q.where('relatedEntityId', '==', filter.relatedEntityId);
    if (filter?.type) q = q.where('type', '==', filter.type);
    if (filter?.limit) q = q.limit(filter.limit);
    const snap = await q.get();
    return snap.docs.map((d) => this.map(d.id, d.data()));
  }

  async log(dto: CreateActivityDto): Promise<Activity> {
    const ref = await this.db.collection(this.col).add({
      ...dto,
      createdBy: dto.createdBy ?? 'system',
      createdAt: this.serverTimestamp(),
    });
    const doc = await ref.get();
    return this.map(doc.id, doc.data()!);
  }

  private map(id: string, data: FirebaseFirestore.DocumentData): Activity {
    return {
      id,
      relatedEntity: data.relatedEntity ?? '',
      relatedEntityId: data.relatedEntityId ?? '',
      type: data.type ?? 'note',
      description: data.description ?? '',
      createdBy: data.createdBy ?? 'system',
      createdAt: this.toDate(data.createdAt),
    };
  }
}
