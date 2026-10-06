import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { OpportunityService } from '../../../core/services/opportunity.service';
import { ToastService } from '../../../core/services/toast.service';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { StageBadge } from '../../../shared/components/stage-badge/stage-badge';
import { Opportunity, Page, Stage, STAGES } from '../../../shared/models/opportunity';

@Component({
  selector: 'app-opportunity-list',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe, StageBadge, Pagination],
  templateUrl: './opportunity-list.html',
  styleUrl: './opportunity-list.scss',
})
export class OpportunityList {
  private service = inject(OpportunityService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly stages = STAGES;
  readonly pageSize = 10;

  searchControl = new FormControl('', { nonNullable: true });
  stageControl = new FormControl<Stage | ''>('', { nonNullable: true });
  loading = signal(false);
  private refresh$ = new Subject<void>();

  private filters$ = this.route.queryParamMap.pipe(
    map((params) => ({
      search: params.get('q') ?? '',
      stage: (params.get('stage') ?? '') as Stage | '',
      page: Number(params.get('page') ?? 1),
    })),
  );

  filters = toSignal(this.filters$, { requireSync: true });

  result = toSignal(
    combineLatest([this.filters$, this.refresh$.pipe(startWith(undefined))]).pipe(
      switchMap(([filters]) => {
        this.loading.set(true);
        return this.service.list({ ...filters, limit: this.pageSize }).pipe(
          catchError(() => of<Page<Opportunity>>({ items: [], total: 0 })),
          finalize(() => this.loading.set(false)),
        );
      }),
    ),
    { initialValue: { items: [], total: 0 } },
  );

  constructor() {
    this.searchControl.setValue(this.filters().search, { emitEvent: false });
    this.stageControl.setValue(this.filters().stage, { emitEvent: false });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((search) => this.updateQuery({ q: search || null, page: null }));

    this.stageControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((stage) => this.updateQuery({ stage: stage || null, page: null }));
  }

  goToPage(page: number) {
    this.updateQuery({ page: page > 1 ? page : null });
  }

  remove(opportunity: Opportunity) {
    if (!confirm(`Excluir a oportunidade "${opportunity.title}"?`)) {
      return;
    }

    this.service.remove(opportunity.id).subscribe(() => {
      this.toast.success('Oportunidade excluída.');
      this.refresh$.next();
    });
  }

  private updateQuery(queryParams: Params) {
    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }
}
