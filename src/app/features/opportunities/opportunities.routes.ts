import { Routes } from '@angular/router';
import { OpportunityDetail } from './opportunity-detail/opportunity-detail';
import { OpportunityForm } from './opportunity-form/opportunity-form';
import { OpportunityList } from './opportunity-list/opportunity-list';

export const OPPORTUNITY_ROUTES: Routes = [
  { path: '', component: OpportunityList },
  { path: 'new', component: OpportunityForm },
  { path: ':id', component: OpportunityDetail },
  { path: ':id/edit', component: OpportunityForm },
];
