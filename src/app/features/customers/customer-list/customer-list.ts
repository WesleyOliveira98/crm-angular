import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './customer-list.html',
})
export class CustomerList {
  private service = inject(CustomerService);

  searchControl = new FormControl('', { nonNullable: true });
  loading = signal(false);

  customers = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
      switchMap((search) => {
        this.loading.set(true);
        return this.service.list(search).pipe(finalize(() => this.loading.set(false)));
      }),
    ),
    { initialValue: [] },
  );
}
