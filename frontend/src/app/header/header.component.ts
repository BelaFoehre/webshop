import { Component, Inject, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService, NbSidebarService, NB_WINDOW } from '@nebular/theme';
import { NbAuthService } from '@nebular/auth';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  user_name: string = "Nicht Angemeldet"
  user_description: string = ""
  user_avatar: string = ""

  items: NbMenuItem[] = [];

  constructor(
    private readonly authService: NbAuthService
  ) {
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
}
