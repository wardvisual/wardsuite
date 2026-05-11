import { Firestore } from 'firebase-admin/firestore';
import { FirestoreBaseAdapter } from './firestore.adapter';
import { ICustomerRepository } from '../../repositories/customer.repository';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@wardsuite/crm/domain';

export class FirestoreCustomerRepository
  extends FirestoreBaseAdapter
  implements ICustomerRepository
{
  private readonly col = 'crm_customers';

  constructor(db: Firestore) {
    super(db);
  }

  async findAll(): Promise<Customer[]> {
    const snap = await this.db.collection(this.col).orderBy('createdAt', 'desc').get();
    return snap.docs.map((d) => this.map(d.id, d.data()));
  }

  async findById(id: string): Promise<Customer | null> {
    const doc = await this.db.collection(this.col).doc(id).get();
    return doc.exists ? this.map(doc.id, doc.data()!) : null;
  }

  async create(dto: CreateCustomerDto, actorId = 'system'): Promise<Customer> {
    const code = await this.nextCode(this.col, 'CUST');
    const now = this.serverTimestamp();
    const ref = await this.db.collection(this.col).add({
      ...dto,
      code,
      status: dto.status ?? 'active',
      accountManagerId: dto.accountManagerId ?? actorId,
      createdAt: now,
      updatedAt: now,
    });
    return (await this.findById(ref.id))!;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    await this.db
      .collection(this.col)
      .doc(id)
      .update({ ...dto, updatedAt: this.serverTimestamp() });
    return (await this.findById(id))!;
  }

  async remove(id: string): Promise<void> {
    await this.db.collection(this.col).doc(id).delete();
  }

  private map(id: string, data: FirebaseFirestore.DocumentData): Customer {
    return {
      id,
      code: data.code ?? '',
      name: data.name ?? '',
      company: data.company ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      address: data.address ?? '',
      accountManagerId: data.accountManagerId ?? '',
      status: data.status ?? 'active',
      createdAt: this.toDate(data.createdAt),
      updatedAt: this.toDate(data.updatedAt),
    };
  }
}
