import { Pipe, PipeTransform } from '@angular/core';
import { Stage, STAGES } from '../models/opportunity';

@Pipe({ name: 'stageLabel' })
export class StageLabelPipe implements PipeTransform {
  transform(stage: Stage): string {
    return STAGES.find((item) => item.value === stage)?.label ?? stage;
  }
}
