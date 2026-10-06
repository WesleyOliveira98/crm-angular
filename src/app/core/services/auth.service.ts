import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginResponse, User } from '../../shared/models/user';

const TOKEN_KEY = 'crm.token';
const USER_KEY = 'crm.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private token = signal(localStorage.getItem(TOKEN_KEY));

  currentUser = signal<User | null>(this.readStoredUser());
  isLoggedIn = computed(() => this.token() !== null);

  login(email: string, password: string) {
    return this.http.post<LoginResponse>('/api/login', { email, password }).pipe(
      tap(({ token, user }) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.token.set(token);
        this.currentUser.set(user);
      }),
    );
  }

  logout(returnUrl?: string) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login'], { queryParams: returnUrl ? { returnUrl } : {} });
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  private readStoredUser(): User | null {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
