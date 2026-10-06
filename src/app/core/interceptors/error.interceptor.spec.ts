import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let toast: ToastService;
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    toast = TestBed.inject(ToastService);
    auth = TestBed.inject(AuthService);
  });

  it('should logout when the API returns 401', () => {
    const logout = vi.spyOn(auth, 'logout').mockImplementation(() => {});

    http.get('/api/customers').subscribe({ error: () => {} });
    httpTesting
      .expectOne('/api/customers')
      .flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(logout).toHaveBeenCalled();
    expect(toast.toasts()[0].message).toContain('sessão expirou');
  });

  it('should show a message for 404', () => {
    http.get('/api/customers/99').subscribe({ error: () => {} });
    httpTesting
      .expectOne('/api/customers/99')
      .flush(null, { status: 404, statusText: 'Not Found' });

    expect(toast.toasts()[0].message).toBe('Registro não encontrado.');
  });

  it('should leave login errors to the login page', () => {
    const logout = vi.spyOn(auth, 'logout');

    http.post('/api/login', {}).subscribe({ error: () => {} });
    httpTesting.expectOne('/api/login').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(logout).not.toHaveBeenCalled();
    expect(toast.toasts().length).toBe(0);
  });
});
