import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Guarda para proteger rutas privadas (solo accesibles si el usuario está logueado)
 */
export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.authLoading).pipe(
    filter((loading) => !loading), // Espera a que termine la carga inicial de Firebase Auth
    take(1),
    map(() => {
      if (authService.currentUser()) {
        return true;
      } else {
        return router.parseUrl('/login');
      }
    })
  );
};

/**
 * Guarda para evitar que usuarios logueados accedan al Login o Registro
 */
export const publicGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.authLoading).pipe(
    filter((loading) => !loading), // Espera a que termine la carga inicial de Firebase Auth
    take(1),
    map(() => {
      if (authService.currentUser()) {
        return router.parseUrl('/home');
      } else {
        return true;
      }
    })
  );
};
