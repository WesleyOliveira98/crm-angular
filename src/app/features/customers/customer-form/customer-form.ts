import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import { Customer } from '../../../shared/models/customer';

@Component({
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './customer-form.html',
})
export class CustomerForm {
  private fb = inject(FormBuilder);
  private service = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly id = Number(this.route.snapshot.paramMap.get('id')) || null;

  saving = signal(false);
  private current?: Customer;

  form = this.fb.nonNullable.group({
    company: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    city: [''],
  });

  constructor() {
    if (this.id) {
      this.service.get(this.id).subscribe((customer) => {
        this.current = customer;
        this.form.patchValue(customer);
      });
    }
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

    const payload = {
      ...this.form.getRawValue(),
      createdAt: this.current?.createdAt ?? new Date().toISOString().slice(0, 10),
    };
    const request = this.id ? this.service.update(this.id, payload) : this.service.create(payload);

    this.saving.set(true);
    request.pipe(finalize(() => this.saving.set(false))).subscribe((saved) => {
      this.toast.success(this.id ? 'Cliente atualizado.' : 'Cliente criado.');
      this.router.navigate(['/customers', saved.id]);
    });
  }
}
