// ─── Entity ──────────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  relatedEntity: string;
  relatedEntityId: string;
  type: ActivityType;
  description: string;
  createdBy: string;
  createdAt: string;
}

export type ActivityType = 'call' | 'meeting' | 'note' | 'email' | 'audit';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateActivityDto {
  relatedEntity: string;
  relatedEntityId: string;
  type: ActivityType;
  description: string;
  createdBy?: string;
}
