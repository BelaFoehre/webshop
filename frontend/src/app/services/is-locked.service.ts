import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class isLockedGuard implements CanActivate {

/**
 * The constructor function is a default function that runs whenever we create a new instance of this class
 * @param {AuthService} authService - This is the service that we created earlier.
 * @param {ToastrService} toastr - This is the service that we'll use to display messages to the user.
 * @param {Router} router - Router - This is the Angular Router service that we'll use to navigate to
 * the home page after the user has logged in.
 */
  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) { }

  /**
   * If the user is locked, show a toastr error message and redirect to the login page
   * @returns A boolean value.
   */
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.authService.setToken()
    let user: UserModel | null = this.authService.getUser()

    const isLocked = user?.locked
    const locked_msg = user?.locked_message || 'Dieser Account wurde gesperrt'

    if(isLocked){
      this.toastr.error(locked_msg, 'Account gesperrt', { closeButton: true })
        .onHidden
        .subscribe(() => {
          if(this.router.url == '/auth/login'){
            window.location.reload()
          } else {
            this.router.navigate(['/auth/login'])
          }
        })
    }

    return !isLocked || false
  }
}
