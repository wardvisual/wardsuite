import { Firestore } from 'firebase-admin/firestore';
import { FirestoreBaseAdapter } from './firestore.adapter';
import { IDealRepository } from '../../repositories/deal.repository';
import { Deal, CreateDealDto, UpdateDealDto, DealStage } from '@wardsuite/crm/domain';

export class FirestoreDealRepository
  extends FirestoreBaseAdapter
  implements IDealRepository
{
  private readonly col = 'crm_deals';

  constructor(db: Firestore) {
    super(db);
  }

  async findAll(): Promise<Deal[]> {
    const snap = await this.db.collection(this.col).orderBy('createdAt', 'desc').get();
    return snap.docs.map((d) => this.map(d.id, d.data()));
  }

  async findById(id: string): Promise<Deal | null> {
    const doc = await this.db.collection(this.col).doc(id).get();
    return doc.exists ? this.map(doc.id, doc.data()!) : null;
  }

  async create(dto: CreateDealDto, actorId = 'system'): Promise<Deal> {
    const code = await this.nextCode(this.col, 'DEAL');
    const now = this.serverTimestamp();
    const ref = await this.db.collection(this.col).add({
      ...dto,
      code,
      stage: dto.stage ?? 'open',
      ownerId: dto.ownerId ?? actorId,
      createdAt: now,
      updatedAt: now,
    });
    return (await this.findById(ref.id))!;
  }

  async update(id: string, dto: UpdateDealDto): Promise<Deal> {
    await this.db
      .collection(this.col)
      .doc(id)
      .update({ ...dto, updatedAt: this.serverTimestamp() });
    return (await this.findById(id))!;
  }

  async updateStage(id: string, stage: DealStage): Promise<Deal> {
    return this.update(id, { stage });
  }

  async remove(id: string): Promise<void> {
    await this.db.collection(this.col).doc(id).delete();
  }

  private map(id: string, data: FirebaseFirestore.DocumentData): Deal {
    return {
      id,
      code: data.code ?? '',
      title: data.title ?? '',
      customerId: data.customerId ?? '',
      leadId: data.leadId,
      amount: data.amount ?? 0,
      stage: data.stage ?? 'open',
      ownerId: data.ownerId ?? '',
      expectedCloseDate: data.expectedCloseDate ?? '',
      notes: data.notes,
      createdAt: this.toDate(data.createdAt),
      updatedAt: this.toDate(data.updatedAt),
    };
  }
}
