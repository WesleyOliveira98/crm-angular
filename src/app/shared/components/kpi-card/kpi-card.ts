import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  template: `
    <span class="label">{{ label() }}</span>
    <strong class="value"><ng-content /></strong>
    @if (hint()) {
      <span class="hint">{{ hint() }}</span>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 1rem 1.25rem;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius);
    }

    .label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--muted);
    }

    .value {
      font-family: var(--font-mono);
      font-size: 1.5rem;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }

    .hint {
      font-size: 0.85rem;
      color: var(--muted);
    }
  `,
})
export class KpiCard {
  label = input.required<string>();
  hint = input('');
}
