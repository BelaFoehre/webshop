import { Injectable } from "@angular/core";
import { NbAuthService } from "@nebular/auth";
import { UserModel } from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class AuthService extends NbAuthService {

  user: UserModel | undefined | null
  token: string | undefined

/**
 * If the token exists, return the user model, otherwise return null
 * @returns The user model
 */
  getUser(): UserModel | null{
    if(!this.token){
      return null
    }
    return JSON.parse(atob(this.token.split('.')[1])) as UserModel
  }

/**
 * The function sets the token to the value of the token returned by the getToken() function
 */
  setToken(){
    this.getToken().subscribe((res) => {
      this.token = res.toString()
    })
  }

}
