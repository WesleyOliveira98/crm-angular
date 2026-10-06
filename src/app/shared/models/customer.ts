export interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
}

export type CustomerPayload = Omit<Customer, 'id'>;
