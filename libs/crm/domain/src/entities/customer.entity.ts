export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
  id: string;
  code: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  accountManagerId: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  name: string;
  company: string;
  email: string;
  phone?: string;
  address?: string;
  accountManagerId?: string;
  status?: CustomerStatus;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}
