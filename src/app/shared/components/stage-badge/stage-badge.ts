import { Component, input } from '@angular/core';
import { Stage } from '../../models/opportunity';
import { StageLabelPipe } from '../../pipes/stage-label.pipe';

@Component({
  selector: 'app-stage-badge',
  imports: [StageLabelPipe],
  template: `<span class="badge" [class]="stage()">{{ stage() | stageLabel }}</span>`,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text);

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 2px;
        background: var(--color);
      }
    }

    .new {
      --color: var(--stage-new);
    }
    .qualified {
      --color: var(--stage-qualified);
    }
    .proposal {
      --color: var(--stage-proposal);
    }
    .won {
      --color: var(--stage-won);
    }
  `,
})
export class StageBadge {
  stage = input.required<Stage>();
}
