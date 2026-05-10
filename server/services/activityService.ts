import { Activity } from '../types/models';
import { CreateActivityDto } from '../dto/activity.dto';

interface AuditOptions {
  relatedEntityId: string;
  action: 'created' | 'updated' | 'deleted' | 'converted';
  actorId: string;
  summary: string;
}

class ActivityService {
  private activities: Activity[] = [
    { id: '1', relatedEntity: 'lead', relatedEntityId: '1', type: 'call', description: 'Initial discovery call with Alice Cooper. She is interested in enterprise plan.', createdBy: 'u2', createdAt: '2025-03-05T09:00:00Z' },
    { id: '2', relatedEntity: 'lead', relatedEntityId: '2', type: 'meeting', description: 'Demo meeting with Bob Martin — showed product roadmap.', createdBy: 'u2', createdAt: '2025-03-12T14:00:00Z' },
    { id: '3', relatedEntity: 'deal', relatedEntityId: '1', type: 'note', description: 'Customer requested extended payment terms in the contract.', createdBy: 'u2', createdAt: '2025-04-15T11:30:00Z' },
    { id: '4', relatedEntity: 'customer', relatedEntityId: '1', type: 'email', description: 'Sent onboarding documentation and next steps.', createdBy: 'u3', createdAt: '2025-04-20T16:00:00Z' },
  ];

  async getAll(relatedEntity?: string, relatedEntityId?: string, type?: string): Promise<Activity[]> {
    return this.activities.filter(a => {
      if (relatedEntity && a.relatedEntity !== relatedEntity) return false;
      if (relatedEntityId && a.relatedEntityId !== relatedEntityId) return false;
      if (type && a.type !== type) return false;
      return true;
    });
  }

  async create(dto: CreateActivityDto): Promise<Activity> {
    const item: Activity = {
      id: Math.random().toString(36).substring(2, 11),
      relatedEntity: dto.relatedEntity,
      relatedEntityId: dto.relatedEntityId,
      type: dto.type,
      description: dto.description,
      createdBy: dto.createdBy ?? 'u1',
      createdAt: new Date().toISOString(),
    };
    this.activities.push(item);
    return item;
  }

  // System-generated audit trail entry (type: 'audit') linked to a lead
  async logAudit(opts: AuditOptions): Promise<Activity> {
    const item: Activity = {
      id: Math.random().toString(36).substring(2, 11),
      relatedEntity: 'lead',
      relatedEntityId: opts.relatedEntityId,
      type: 'audit',
      description: opts.summary,
      createdBy: opts.actorId,
      createdAt: new Date().toISOString(),
    };
    this.activities.push(item);
    return item;
  }

  recentCount(hours = 48): number {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    return this.activities.filter(a => a.createdAt >= cutoff).length;
  }
}

export const activityService = new ActivityService();
