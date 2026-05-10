export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierDto {
  code?: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status?: 'active' | 'inactive';
  notes?: string;
}

export type UpdateSupplierDto = Partial<CreateSupplierDto>;
