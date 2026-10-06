import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CustomerService } from '../../../core/services/customer.service';
import { OpportunityService } from '../../../core/services/opportunity.service';
import { ToastService } from '../../../core/services/toast.service';
import { Customer } from '../../../shared/models/customer';
import { Opportunity, OpportunityPayload, Stage, STAGES } from '../../../shared/models/opportunity';

@Component({
  selector: 'app-opportunity-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './opportunity-form.html',
})
export class OpportunityForm {
  private fb = inject(FormBuilder);
  private service = inject(OpportunityService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly stages = STAGES;
  readonly id = Number(this.route.snapshot.paramMap.get('id')) || null;

  private customerService = inject(CustomerService);

  customers = signal<Customer[]>([]);
  saving = signal(false);
  private current?: Opportunity;

  form = this.fb.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    customerId: this.fb.control<number | null>(null, Validators.required),
    contactEmail: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    value: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    stage: this.fb.nonNullable.control<Stage>('new', Validators.required),
    probability: this.fb.nonNullable.control(10, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
    expectedCloseDate: this.fb.nonNullable.control('', Validators.required),
  });

  constructor() {
    this.customerService.list().subscribe((customers) => {
      this.customers.set(customers);

      const customerId = Number(this.route.snapshot.queryParamMap.get('customerId'));
      if (customerId) {
        this.form.controls.customerId.setValue(customerId);
      }
    });

    if (this.id) {
      this.service.get(this.id).subscribe((opportunity) => {
        this.current = opportunity;
        this.form.patchValue(opportunity);
      });
    }

    this.form.controls.customerId.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((customerId) => {
        const customer = this.customers().find((item) => item.id === customerId);
        if (customer && !this.form.controls.contactEmail.value) {
          this.form.controls.contactEmail.setValue(customer.email);
        }
      });
  }

  showError(field: keyof typeof this.form.controls, error: string) {
    const control = this.form.controls[field];
    return control.touched && control.hasError(error);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: OpportunityPayload = {
      ...value,
      customerId: value.customerId!,
      value: value.value!,
      createdAt: this.current?.createdAt ?? new Date().toISOString().slice(0, 10),
    };

    const request = this.id ? this.service.update(this.id, payload) : this.service.create(payload);

    this.saving.set(true);
    request.pipe(finalize(() => this.saving.set(false))).subscribe((saved) => {
      this.toast.success(this.id ? 'Oportunidade atualizada.' : 'Oportunidade criada.');
      this.router.navigate(['/opportunities', saved.id]);
    });
  }
}
