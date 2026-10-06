import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should save the token and the user after login', () => {
    service.login('admin@crm.com', '123456').subscribe();

    const req = httpTesting.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@crm.com', password: '123456' });
    req.flush({ token: 'fake-token-1', user: { id: 1, name: 'Admin', email: 'admin@crm.com' } });

    expect(service.getToken()).toBe('fake-token-1');
    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUser()?.name).toBe('Admin');
  });

  it('should clear the session and go to login on logout', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    localStorage.setItem('crm.token', 'fake-token-1');

    service.logout('/kanban');

    expect(service.getToken()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/kanban' } });
  });
});
