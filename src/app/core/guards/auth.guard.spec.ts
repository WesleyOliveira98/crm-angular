import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const runGuard = (url: string) =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
    );

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])],
    });
  });

  it('should allow the route when there is a token', () => {
    localStorage.setItem('crm.token', 'fake-token-1');
    expect(runGuard('/dashboard')).toBe(true);
  });

  it('should redirect to login keeping the original url', () => {
    const result = runGuard('/opportunities?stage=won') as UrlTree;

    expect(result).toBeInstanceOf(UrlTree);
    expect(result.toString()).toBe('/login?returnUrl=%2Fopportunities%3Fstage%3Dwon');
  });
});
