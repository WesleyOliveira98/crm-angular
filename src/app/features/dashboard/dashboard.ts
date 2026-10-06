import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { CustomerService } from '../../core/services/customer.service';
import { OpportunityService } from '../../core/services/opportunity.service';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { StageBadge } from '../../shared/components/stage-badge/stage-badge';
import { STAGES } from '../../shared/models/opportunity';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe, DatePipe, DecimalPipe, KpiCard, StageBadge],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private opportunityService = inject(OpportunityService);
  private customerService = inject(CustomerService);

  error = signal(false);

  private data = toSignal(
    forkJoin({
      opportunities: this.opportunityService.getAll(),
      customers: this.customerService.list(),
    }).pipe(
      catchError(() => {
        this.error.set(true);
        return of({ opportunities: [], customers: [] });
      }),
    ),
  );

  loading = computed(() => this.data() === undefined);
  opportunities = computed(() => this.data()?.opportunities ?? []);
  customersCount = computed(() => this.data()?.customers.length ?? 0);

  private open = computed(() => this.opportunities().filter((item) => item.stage !== 'won'));

  leads = computed(() => this.opportunities().filter((item) => item.stage === 'new').length);
  pipeline = computed(() => this.open().reduce((sum, item) => sum + item.value, 0));
  forecast = computed(() =>
    this.open().reduce((sum, item) => sum + (item.value * item.probability) / 100, 0),
  );
  conversionRate = computed(() => {
    const total = this.opportunities().length;
    const won = total - this.open().length;
    return total ? (won / total) * 100 : 0;
  });

  stages = computed(() => {
    const total = this.opportunities().reduce((sum, item) => sum + item.value, 0);
    return STAGES.map((stage) => {
      const items = this.opportunities().filter((item) => item.stage === stage.value);
      const amount = items.reduce((sum, item) => sum + item.value, 0);
      return { ...stage, count: items.length, amount, share: total ? (amount / total) * 100 : 0 };
    });
  });

  recent = computed(() => this.opportunities().slice(0, 5));
}
