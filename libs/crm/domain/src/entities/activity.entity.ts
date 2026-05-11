export type ActivityType = 'call' | 'meeting' | 'note' | 'email' | 'audit';

export interface Activity {
  id: string;
  relatedEntity: string;
  relatedEntityId: string;
  type: ActivityType;
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateActivityDto {
  relatedEntity: string;
  relatedEntityId: string;
  type: ActivityType;
  description: string;
  createdBy?: string;
}
