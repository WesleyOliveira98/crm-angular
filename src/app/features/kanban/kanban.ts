import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { OpportunityService } from '../../core/services/opportunity.service';
import { Opportunity, Stage, STAGES } from '../../shared/models/opportunity';

@Component({
  selector: 'app-kanban',
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, CurrencyPipe, RouterLink],
  templateUrl: './kanban.html',
  styleUrl: './kanban.scss',
})
export class Kanban {
  private service = inject(OpportunityService);

  opportunities = signal<Opportunity[]>([]);
  loading = signal(true);

  columns = computed(() =>
    STAGES.map((stage) => {
      const items = this.opportunities().filter((item) => item.stage === stage.value);
      return {
        ...stage,
        items,
        total: items.reduce((sum, item) => sum + item.value, 0),
      };
    }),
  );

  constructor() {
    this.service
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((opportunities) => this.opportunities.set(opportunities));
  }

  drop(event: CdkDragDrop<Stage, Stage, Opportunity>) {
    if (event.previousContainer === event.container) {
      return;
    }

    const opportunity = event.item.data;
    const newStage = event.container.data;

    this.changeStage(opportunity.id, newStage);
    this.service.updateStage(opportunity.id, newStage).subscribe({
      error: () => this.changeStage(opportunity.id, opportunity.stage),
    });
  }

  private changeStage(id: number, stage: Stage) {
    this.opportunities.update((list) =>
      list.map((item) => (item.id === id ? { ...item, stage } : item)),
    );
  }
}
