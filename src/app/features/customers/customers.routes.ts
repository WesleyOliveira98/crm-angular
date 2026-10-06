import { Routes } from '@angular/router';
import { CustomerDetail } from './customer-detail/customer-detail';
import { CustomerForm } from './customer-form/customer-form';
import { CustomerList } from './customer-list/customer-list';

export const CUSTOMER_ROUTES: Routes = [
  { path: '', component: CustomerList },
  { path: 'new', component: CustomerForm },
  { path: ':id', component: CustomerDetail },
  { path: ':id/edit', component: CustomerForm },
];
