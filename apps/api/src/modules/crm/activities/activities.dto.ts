// ─── Entity ──────────────────────────────────────────────────────────────────

export type ActivityType = 'call' | 'meeting' | 'note' | 'email' | 'audit';

export type AuditAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'converted'
  | 'stage_changed'
  | 'logged';

export interface Activity {
  id: string;
  relatedEntity: string;
  relatedEntityId: string;
  type: ActivityType;
  action?: AuditAction;
  description: string;
  createdBy: string;
  createdByName?: string;
  ipAddress?: string;
  createdAt: string;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateActivityDto {
  relatedEntity: string;
  relatedEntityId: string;
  type: ActivityType;
  action?: AuditAction;
  description: string;
  createdBy?: string;
  createdByName?: string;
  ipAddress?: string;
}
