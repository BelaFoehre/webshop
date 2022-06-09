import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class hasRoleGuard implements CanActivate {

/**
 * The constructor function is a default function that runs whenever we create a new instance of this
 * class
 * @param {AuthService} authService - This is the service that we created earlier.
 * @param {ToastrService} toastr - This is a service that we'll use to display messages to the user.
 * @param {Router} router - Router - This is the Angular Router service that we'll use to navigate to
 * the home page after the user has logged in.
 */
  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) { }

  /**
   * If the user is not authorized, show a toastr message and redirect to the home page
   * @param {ActivatedRouteSnapshot} route - ActivatedRouteSnapshot
   * @returns A boolean value
   */
  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.authService.setToken()
    let user: UserModel | null = this.authService.getUser()

    const isAuthorized = user?.roles.includes(route.data['role'])

    if(!isAuthorized){
      this.toastr.error('Sie sind nicht authorisiert', 'Nicht authorisiert', { timeOut: 1000 })
        .onHidden
        .subscribe(() => {
          this.router.navigate(['/'])
        })

    }

    return isAuthorized || false
  }

}
