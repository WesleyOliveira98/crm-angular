import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <div class="pagination">
      <span class="info">{{ total() }} {{ total() === 1 ? 'registro' : 'registros' }}</span>
      <button
        class="btn"
        type="button"
        [disabled]="page() <= 1"
        (click)="pageChange.emit(page() - 1)"
      >
        Anterior
      </button>
      <span class="mono">{{ page() }} / {{ totalPages() }}</span>
      <button
        class="btn"
        type="button"
        [disabled]="page() >= totalPages()"
        (click)="pageChange.emit(page() + 1)"
      >
        Próxima
      </button>
    </div>
  `,
  styles: `
    .pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .info {
      margin-right: auto;
      color: var(--muted);
    }
  `,
})
export class Pagination {
  page = input.required<number>();
  total = input.required<number>();
  pageSize = input(10);
  pageChange = output<number>();

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
}
