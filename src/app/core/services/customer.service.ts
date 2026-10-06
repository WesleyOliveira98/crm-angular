import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Customer } from '../../shared/models/customer';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private url = '/api/customers';

  list() {
    return this.http.get<Customer[]>(this.url, { params: { _sort: 'company', _order: 'asc' } });
  }
}
