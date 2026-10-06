import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Customer, CustomerPayload } from '../../shared/models/customer';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private url = '/api/customers';

  list(search = '') {
    let params = new HttpParams().set('_sort', 'company').set('_order', 'asc');
    if (search) {
      params = params.set('q', search);
    }
    return this.http.get<Customer[]>(this.url, { params });
  }

  get(id: number) {
    return this.http.get<Customer>(`${this.url}/${id}`);
  }

  create(payload: CustomerPayload) {
    return this.http.post<Customer>(this.url, payload);
  }

  update(id: number, payload: CustomerPayload) {
    return this.http.put<Customer>(`${this.url}/${id}`, payload);
  }
}
