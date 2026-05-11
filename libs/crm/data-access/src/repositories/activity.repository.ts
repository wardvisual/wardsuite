import { Activity, CreateActivityDto } from '@wardsuite/crm/domain';

export interface ActivityFilter {
  relatedEntity?: string;
  relatedEntityId?: string;
  type?: Activity['type'];
  limit?: number;
}

export interface IActivityRepository {
  findAll(filter?: ActivityFilter): Promise<Activity[]>;
  log(dto: CreateActivityDto): Promise<Activity>;
}
