import { db } from '@server/core/database/firestore.client';
import { Activity, AuditAction, CreateActivityDto } from './activities.dto';

const COLLECTION = 'crm_activities';

interface AuditOptions {
  relatedEntity?: string;
  relatedEntityId: string;
  action: AuditAction;
  actorId: string;
  actorName?: string;
  summary: string;
  ipAddress?: string;
}

function toActivity(id: string, data: FirebaseFirestore.DocumentData): Activity {
  return { id, ...data } as Activity;
}

class ActivitiesService {
  private col = db.collection(COLLECTION);

  async getAll(
    relatedEntity?: string,
    relatedEntityId?: string,
    type?: string,
    limit = 50,
    offset = 0,
  ): Promise<{ items: Activity[]; total: number }> {
    // Fetch all then filter in-memory to avoid composite index requirements.
    const snap = await this.col.orderBy('createdAt', 'desc').get();
    let results = snap.docs.map(d => toActivity(d.id, d.data()));
    if (relatedEntity) results = results.filter(a => a.relatedEntity === relatedEntity);
    if (relatedEntityId) results = results.filter(a => a.relatedEntityId === relatedEntityId);
    if (type) results = results.filter(a => a.type === type);

    const total = results.length;
    return { items: results.slice(offset, offset + limit), total };
  }

  async create(dto: CreateActivityDto): Promise<Activity> {
    const data = {
      relatedEntity: dto.relatedEntity,
      relatedEntityId: dto.relatedEntityId,
      type: dto.type,
      ...(dto.action && { action: dto.action }),
      description: dto.description,
      createdBy: dto.createdBy ?? 'system',
      createdByName: dto.createdByName ?? dto.createdBy ?? 'System',
      ipAddress: dto.ipAddress ?? 'unknown',
      createdAt: new Date().toISOString(),
    };
    const ref = await this.col.add(data);
    return { id: ref.id, ...data };
  }

  async logAudit(opts: AuditOptions): Promise<Activity> {
    return this.create({
      relatedEntity: opts.relatedEntity ?? 'system',
      relatedEntityId: opts.relatedEntityId,
      type: 'audit',
      action: opts.action,
      description: opts.summary,
      createdBy: opts.actorId,
      createdByName: opts.actorName,
      ipAddress: opts.ipAddress,
    });
  }

  async recentCount(hours = 48): Promise<number> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    const snap = await this.col.where('createdAt', '>=', cutoff).count().get();
    return snap.data().count;
  }
}

export const activitiesService = new ActivitiesService();
