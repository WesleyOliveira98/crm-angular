import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private lastId = 0;

  toasts = signal<Toast[]>([]);

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  dismiss(id: number) {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private show(message: string, type: Toast['type']) {
    const id = ++this.lastId;
    this.toasts.update((toasts) => [...toasts, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}
