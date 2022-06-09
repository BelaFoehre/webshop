import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

/**
 * The constructor function is a default function that runs whenever we create a new instance of the AuthGuard class
 * @param {AuthService} authService - This is the service that we created earlier.
 * @param {Router} router - Router - This is the Angular Router service. We'll use this to navigate to the login page.
 */
  constructor(private authService: AuthService, private router: Router) {}

/**
 * If the user is not authenticated, redirect them to the login page
 * @returns Observable<boolean>
 */
  canActivate() {
    return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated) {
            this.router.navigate(['/auth/login']);
          }
        }),
      );
  }
}
