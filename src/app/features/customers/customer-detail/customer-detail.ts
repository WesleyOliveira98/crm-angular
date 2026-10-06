import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';
import { CustomerService } from '../../../core/services/customer.service';
import { OpportunityService } from '../../../core/services/opportunity.service';
import { StageBadge } from '../../../shared/components/stage-badge/stage-badge';

@Component({
  selector: 'app-customer-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe, StageBadge],
  templateUrl: './customer-detail.html',
})
export class CustomerDetail {
  private customerService = inject(CustomerService);
  private opportunityService = inject(OpportunityService);
  private route = inject(ActivatedRoute);

  data = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) =>
        forkJoin({
          customer: this.customerService.get(id),
          opportunities: this.opportunityService.getByCustomer(id),
        }),
      ),
    ),
  );

  totalWon = computed(() =>
    (this.data()?.opportunities ?? [])
      .filter((item) => item.stage === 'won')
      .reduce((sum, item) => sum + item.value, 0),
  );
}
