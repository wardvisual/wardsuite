export interface CreateActivityDto {
  relatedEntity: string;
  relatedEntityId: string;
  type: 'call' | 'meeting' | 'note' | 'email';
  description: string;
  createdBy?: string;
}
