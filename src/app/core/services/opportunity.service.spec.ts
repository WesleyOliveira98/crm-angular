import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OpportunityService } from './opportunity.service';

describe('OpportunityService', () => {
  let service: OpportunityService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OpportunityService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should send search, stage and pagination params', () => {
    service.list({ search: 'odoo', stage: 'proposal', page: 2, limit: 10 }).subscribe();

    const req = httpTesting.expectOne((r) => r.url === '/api/opportunities');
    expect(req.request.params.get('q')).toBe('odoo');
    expect(req.request.params.get('stage')).toBe('proposal');
    expect(req.request.params.get('_page')).toBe('2');
    expect(req.request.params.get('_limit')).toBe('10');
    req.flush([]);
  });

  it('should not send empty filters', () => {
    service.list({ search: '', stage: '', page: 1, limit: 10 }).subscribe();

    const req = httpTesting.expectOne((r) => r.url === '/api/opportunities');
    expect(req.request.params.has('q')).toBe(false);
    expect(req.request.params.has('stage')).toBe(false);
    req.flush([]);
  });

  it('should read the total from the X-Total-Count header', () => {
    let total = 0;
    service
      .list({ search: '', stage: '', page: 1, limit: 10 })
      .subscribe((page) => (total = page.total));

    httpTesting
      .expectOne((r) => r.url === '/api/opportunities')
      .flush([], { headers: { 'X-Total-Count': '41' } });

    expect(total).toBe(41);
  });

  it('should patch only the stage', () => {
    service.updateStage(5, 'won').subscribe();

    const req = httpTesting.expectOne('/api/opportunities/5');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ stage: 'won' });
    req.flush({});
  });
});
