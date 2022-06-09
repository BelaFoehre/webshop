import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { UserModel } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user_name: string = "Nicht Angemeldet"
  user_description: string = ""
  user_avatar: string = ""
  isAdmin: boolean = false

  items: NbMenuItem[] = [];

/**
 * We subscribe to the onTokenChange() function of the AuthService and if the token is valid we set the
 * items array to contain the profile, logout and orders links. If the token is not valid we set the
 * items array to contain the login and register links
 * @param {AuthService} authService - AuthService - this is the service we created earlier.
 */
  constructor(private readonly authService: AuthService) {
    this.authService.onTokenChange().subscribe((token) => {
      if(token.isValid()){
        this.items = [
          { title: 'Profil' },
          { title: 'Logout', link: '/auth/logout' },
          { title: 'Bestellungen', link: '/orders' }
        ]
        let payload = token.getPayload()
        this.user_name = `${payload.name} ${payload.surname}`
      } else {
        this.items = [
          { title: 'Login', link: '/auth/login' },
          { title: 'Registrieren', link: '/auth/register' }
        ]
      }
    })
  }

/**
 * We're checking if the user is an admin, and if they are, we're setting the isAdmin variable to true
 */
  ngOnInit(): void {
    this.authService.setToken()
    let user: UserModel | null = this.authService.getUser()
    if(user?.roles.includes("Admin")) this.isAdmin = true
  }
}
