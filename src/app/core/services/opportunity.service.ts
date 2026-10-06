import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Opportunity, OpportunityPayload, Page, Stage } from '../../shared/models/opportunity';

export interface OpportunityFilters {
  search: string;
  stage: Stage | '';
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class OpportunityService {
  private http = inject(HttpClient);
  private url = '/api/opportunities';

  list({ search, stage, page, limit }: OpportunityFilters) {
    let params = new HttpParams()
      .set('_page', page)
      .set('_limit', limit)
      .set('_sort', 'createdAt')
      .set('_order', 'desc')
      .set('_expand', 'customer');

    if (search) {
      params = params.set('q', search);
    }
    if (stage) {
      params = params.set('stage', stage);
    }

    return this.http.get<Opportunity[]>(this.url, { params, observe: 'response' }).pipe(
      map((response): Page<Opportunity> => ({
        items: response.body ?? [],
        total: Number(response.headers.get('X-Total-Count') ?? 0),
      })),
    );
  }

  getAll() {
    return this.http.get<Opportunity[]>(this.url, {
      params: { _expand: 'customer', _sort: 'createdAt', _order: 'desc' },
    });
  }

  getByCustomer(customerId: number) {
    return this.http.get<Opportunity[]>(this.url, {
      params: { customerId, _sort: 'createdAt', _order: 'desc' },
    });
  }

  get(id: number) {
    return this.http.get<Opportunity>(`${this.url}/${id}`, { params: { _expand: 'customer' } });
  }

  create(payload: OpportunityPayload) {
    return this.http.post<Opportunity>(this.url, payload);
  }

  update(id: number, payload: OpportunityPayload) {
    return this.http.put<Opportunity>(`${this.url}/${id}`, payload);
  }

  updateStage(id: number, stage: Stage) {
    return this.http.patch<Opportunity>(`${this.url}/${id}`, { stage });
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
