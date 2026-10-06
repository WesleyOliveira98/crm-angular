import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.url.endsWith('/login')) {
        return throwError(() => error);
      }

      switch (error.status) {
        case 0:
          toast.error('Não foi possível conectar com a API. Ela está rodando?');
          break;
        case 401:
          toast.error('Sua sessão expirou. Entre novamente.');
          auth.logout(router.url);
          break;
        case 403:
          toast.error('Você não tem permissão para acessar esse recurso.');
          break;
        case 404:
          toast.error('Registro não encontrado.');
          break;
        default:
          toast.error('Erro inesperado no servidor. Tente novamente.');
      }

      return throwError(() => error);
    }),
  );
};
