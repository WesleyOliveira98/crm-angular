import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toasts" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class.error]="toast.type === 'error'">
          <span>{{ toast.message }}</span>
          <button type="button" (click)="toastService.dismiss(toast.id)" aria-label="Fechar">
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toasts {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      z-index: 50;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 260px;
      max-width: 360px;
      padding: 0.75rem 1rem;
      border-radius: var(--radius);
      border-left: 4px solid var(--stage-won);
      background: var(--ink);
      color: #fff;
      box-shadow: 0 6px 20px rgb(0 0 0 / 0.18);

      &.error {
        border-left-color: var(--danger);
      }

      span {
        flex: 1;
      }

      button {
        border: 0;
        background: none;
        color: inherit;
        font-size: 1.2rem;
        cursor: pointer;
      }
    }
  `,
})
export class Toast {
  toastService = inject(ToastService);
}
