import { Firestore } from 'firebase-admin/firestore';
import { FirestoreBaseAdapter } from './firestore.adapter';
import { ILeadRepository } from '../../repositories/lead.repository';
import { Lead, CreateLeadDto, UpdateLeadDto, LeadStatus } from '@wardsuite/crm/domain';

export class FirestoreLeadRepository
  extends FirestoreBaseAdapter
  implements ILeadRepository
{
  private readonly col = 'crm_leads';

  constructor(db: Firestore) {
    super(db);
  }

  async findAll(): Promise<Lead[]> {
    const snap = await this.db
      .collection(this.col)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((d) => this.map(d.id, d.data()));
  }

  async findById(id: string): Promise<Lead | null> {
    const doc = await this.db.collection(this.col).doc(id).get();
    return doc.exists ? this.map(doc.id, doc.data()!) : null;
  }

  async create(dto: CreateLeadDto, actorId = 'system'): Promise<Lead> {
    const code = await this.nextCode(this.col, 'LEAD');
    const now = this.serverTimestamp();
    const ref = await this.db.collection(this.col).add({
      ...dto,
      code,
      status: dto.status ?? 'new',
      assignedUserId: dto.assignedUserId ?? actorId,
      createdAt: now,
      updatedAt: now,
    });
    return (await this.findById(ref.id))!;
  }

  async update(id: string, dto: UpdateLeadDto, _actorId = 'system'): Promise<Lead> {
    await this.db
      .collection(this.col)
      .doc(id)
      .update({ ...dto, updatedAt: this.serverTimestamp() });
    return (await this.findById(id))!;
  }

  async updateStatus(id: string, status: LeadStatus, actorId?: string): Promise<Lead> {
    return this.update(id, { status }, actorId);
  }

  async batchCreate(dtos: CreateLeadDto[], actorId?: string): Promise<Lead[]> {
    return Promise.all(dtos.map((dto) => this.create(dto, actorId)));
  }

  async remove(id: string): Promise<void> {
    await this.db.collection(this.col).doc(id).delete();
  }

  private map(id: string, data: FirebaseFirestore.DocumentData): Lead {
    return {
      id,
      code: data.code ?? '',
      fullName: data.fullName ?? '',
      company: data.company ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      source: data.source ?? '',
      status: data.status ?? 'new',
      assignedUserId: data.assignedUserId ?? '',
      notes: data.notes,
      createdAt: this.toDate(data.createdAt),
      updatedAt: this.toDate(data.updatedAt),
    };
  }
}
