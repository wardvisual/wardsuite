export interface CreateCustomerDto {
  code?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  accountManagerId?: string;
  status?: 'active' | 'inactive';
}

export type UpdateCustomerDto = Partial<CreateCustomerDto>;
