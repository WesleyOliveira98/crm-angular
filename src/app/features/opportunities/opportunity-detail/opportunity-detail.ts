import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { OpportunityService } from '../../../core/services/opportunity.service';
import { ToastService } from '../../../core/services/toast.service';
import { StageBadge } from '../../../shared/components/stage-badge/stage-badge';

@Component({
  selector: 'app-opportunity-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe, StageBadge],
  templateUrl: './opportunity-detail.html',
})
export class OpportunityDetail {
  private service = inject(OpportunityService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  opportunity = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.service.get(id)),
    ),
  );

  remove() {
    const opportunity = this.opportunity();
    if (!opportunity || !confirm(`Excluir a oportunidade "${opportunity.title}"?`)) {
      return;
    }

    this.service.remove(opportunity.id).subscribe(() => {
      this.toast.success('Oportunidade excluída.');
      this.router.navigate(['/opportunities']);
    });
  }
}
