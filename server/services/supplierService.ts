import { Supplier } from "../../src/types";

class SupplierService {
  private suppliers: Supplier[] = [
    { id: '1', code: 'SUP-001', name: 'TechFlow Systems', contactPerson: 'John Smith', email: 'john@techflow.com', phone: '+1 234 567 8900', address: 'San Francisco, CA', status: 'active' },
    { id: '2', code: 'SUP-002', name: 'Prime Logistics', contactPerson: 'Jane Doe', email: 'jane@prime.com', phone: '+1 234 567 8901', address: 'Chicago, IL', status: 'active' },
  ];

  async getAll(): Promise<Supplier[]> {
    return this.suppliers;
  }

  async create(data: Omit<Supplier, 'id'>): Promise<Supplier> {
    const newItem = { ...data, id: Math.random().toString(36).substr(2, 9) };
    this.suppliers.push(newItem);
    return newItem;
  }

  async update(id: string, data: Partial<Supplier>): Promise<Supplier | undefined> {
    const index = this.suppliers.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    this.suppliers[index] = { ...this.suppliers[index], ...data };
    return this.suppliers[index];
  }

  async delete(id: string): Promise<boolean> {
    const initial = this.suppliers.length;
    this.suppliers = this.suppliers.filter(i => i.id !== id);
    return this.suppliers.length < initial;
  }
}

export const supplierService = new SupplierService();
