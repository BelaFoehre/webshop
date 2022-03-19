import { Injectable } from "@angular/core";
import { NbAuthService } from "@nebular/auth";
import { UserModel } from "./user.model";

@Injectable({ providedIn: 'root' })
export class AuthService extends NbAuthService {

  user: UserModel | undefined | null
  token: string | undefined

  getUser(): UserModel | null{
    if(!this.token){
      return null
    }
    return JSON.parse(atob(this.token.split('.')[1])) as UserModel
  }

  setToken(){
    this.getToken().subscribe((res) => {
      this.token = res.toString()
    })
  }

}
