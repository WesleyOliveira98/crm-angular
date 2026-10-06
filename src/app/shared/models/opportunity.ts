import { Customer } from './customer';

export type Stage = 'new' | 'qualified' | 'proposal' | 'won';

export const STAGES: { value: Stage; label: string }[] = [
  { value: 'new', label: 'Novo' },
  { value: 'qualified', label: 'Qualificado' },
  { value: 'proposal', label: 'Proposta' },
  { value: 'won', label: 'Ganho' },
];

export interface Opportunity {
  id: number;
  title: string;
  customerId: number;
  contactEmail: string;
  value: number;
  stage: Stage;
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
  customer?: Customer;
}

export type OpportunityPayload = Omit<Opportunity, 'id' | 'customer'>;

export interface Page<T> {
  items: T[];
  total: number;
}
