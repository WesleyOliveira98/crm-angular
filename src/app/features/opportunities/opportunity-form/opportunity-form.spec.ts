import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OpportunityForm } from './opportunity-form';

describe('OpportunityForm', () => {
  let component: OpportunityForm;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OpportunityForm],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    component = TestBed.createComponent(OpportunityForm).componentInstance;
  });

  it('should start invalid', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should validate value, e-mail and probability', () => {
    const { value, contactEmail, probability } = component.form.controls;

    value.setValue(0);
    contactEmail.setValue('email-errado');
    probability.setValue(120);

    expect(value.hasError('min')).toBe(true);
    expect(contactEmail.hasError('email')).toBe(true);
    expect(probability.hasError('max')).toBe(true);
  });

  it('should be valid with all fields filled', () => {
    component.form.setValue({
      title: 'Implantação do ERP',
      customerId: 1,
      contactEmail: 'ana@empresa.com.br',
      value: 15000,
      stage: 'proposal',
      probability: 60,
      expectedCloseDate: '2026-12-01',
    });

    expect(component.form.valid).toBe(true);
  });

  it('should mark the fields as touched when saving an invalid form', () => {
    component.save();
    expect(component.showError('title', 'required')).toBe(true);
  });
});
