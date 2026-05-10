export interface CreateActivityDto {
  relatedEntity: string;
  relatedEntityId: string;
  type: 'call' | 'meeting' | 'note' | 'email' | 'audit';
  description: string;
  createdBy?: string;
}
