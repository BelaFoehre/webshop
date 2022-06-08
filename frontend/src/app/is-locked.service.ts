import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class isLockedGuard implements CanActivate {

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) { }

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
