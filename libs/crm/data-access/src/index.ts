// Repository interfaces — use these in service/application code
export type { ILeadRepository } from './repositories/lead.repository';
export type { ICustomerRepository } from './repositories/customer.repository';
export type { IDealRepository } from './repositories/deal.repository';
export type { IActivityRepository, ActivityFilter } from './repositories/activity.repository';

// Firestore implementations — inject these in the API app
export { FirestoreLeadRepository } from './adapters/firestore/lead.firestore.repository';
export { FirestoreCustomerRepository } from './adapters/firestore/customer.firestore.repository';
export { FirestoreDealRepository } from './adapters/firestore/deal.firestore.repository';
export { FirestoreActivityRepository } from './adapters/firestore/activity.firestore.repository';
export { FirestoreBaseAdapter } from './adapters/firestore/firestore.adapter';
