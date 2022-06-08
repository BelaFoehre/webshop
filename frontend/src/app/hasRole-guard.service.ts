import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class hasRoleGuard implements CanActivate {

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) { }

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
