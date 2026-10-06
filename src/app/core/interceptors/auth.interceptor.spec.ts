import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should add the bearer token', () => {
    localStorage.setItem('crm.token', 'fake-token-1');

    http.get('/api/customers').subscribe();

    const req = httpTesting.expectOne('/api/customers');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token-1');
    req.flush([]);
  });

  it('should not add the header without a token', () => {
    http.get('/api/customers').subscribe();

    const req = httpTesting.expectOne('/api/customers');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });
});
