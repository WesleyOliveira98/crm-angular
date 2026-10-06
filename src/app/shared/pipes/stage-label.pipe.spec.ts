import { StageLabelPipe } from './stage-label.pipe';

describe('StageLabelPipe', () => {
  const pipe = new StageLabelPipe();

  it('should translate the stage', () => {
    expect(pipe.transform('new')).toBe('Novo');
    expect(pipe.transform('qualified')).toBe('Qualificado');
    expect(pipe.transform('proposal')).toBe('Proposta');
    expect(pipe.transform('won')).toBe('Ganho');
  });
});
