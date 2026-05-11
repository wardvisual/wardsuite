import { db } from '@server/core/database/firestore.client';
import { Activity, CreateActivityDto } from './activities.dto';

const COLLECTION = 'crm_activities';

interface AuditOptions {
  relatedEntityId: string;
  action: 'created' | 'updated' | 'deleted' | 'converted';
  actorId: string;
  summary: string;
}

function toActivity(id: string, data: FirebaseFirestore.DocumentData): Activity {
  return { id, ...data } as Activity;
}

class ActivitiesService {
  private col = db.collection(COLLECTION);

  async getAll(relatedEntity?: string, relatedEntityId?: string, type?: string): Promise<Activity[]> {
    let query: FirebaseFirestore.Query = this.col.orderBy('createdAt', 'desc');
    if (relatedEntity) query = query.where('relatedEntity', '==', relatedEntity);
    if (relatedEntityId) query = query.where('relatedEntityId', '==', relatedEntityId);
    if (type) query = query.where('type', '==', type);

    const snap = await query.get();
    return snap.docs.map(d => toActivity(d.id, d.data()));
  }

  async create(dto: CreateActivityDto): Promise<Activity> {
    const data = {
      relatedEntity: dto.relatedEntity,
      relatedEntityId: dto.relatedEntityId,
      type: dto.type,
      description: dto.description,
      createdBy: dto.createdBy ?? 'system',
      createdAt: new Date().toISOString(),
    };
    const ref = await this.col.add(data);
    return { id: ref.id, ...data };
  }

  async logAudit(opts: AuditOptions): Promise<Activity> {
    return this.create({
      relatedEntity: 'lead',
      relatedEntityId: opts.relatedEntityId,
      type: 'audit',
      description: opts.summary,
      createdBy: opts.actorId,
    });
  }

  async recentCount(hours = 48): Promise<number> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    const snap = await this.col.where('createdAt', '>=', cutoff).count().get();
    return snap.data().count;
  }
}

export const activitiesService = new ActivitiesService();
