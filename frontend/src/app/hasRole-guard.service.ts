import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class hasRoleGuard implements CanActivate {

  constructor(private authService: AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.authService.setToken()
    let user: UserModel | null = this.authService.getUser()

    // if(user){
    const isAuthorized = user?.roles.includes(route.data['role'])
    // }

    // const isAuthorized = user.roles.include(route.data.['role'])
    if(!isAuthorized){
      window.alert('Fuck you')
    }

    return isAuthorized || false
  }

}
