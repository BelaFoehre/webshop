import { Component, Inject, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService, NbSidebarService, NB_WINDOW } from '@nebular/theme';
import { NbAuthService } from '@nebular/auth';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user_name: string = "Manuel Neuer"
  user_description: string = "chef"
  user_avatar: string = ""

  items: NbMenuItem[] = [];

  constructor(
    // private nbMenuService: NbMenuService, @Inject(NB_WINDOW) private window: any,
    private readonly sidebarService: NbSidebarService,
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

  /**
   * Toggles the animation for the sidebar to open or close it.
   * @returns `false`
   */
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'left');
    return false;
  }

  ngOnInit() {
  //   this.nbMenuService.onItemClick()
  //     .pipe(
  //       filter(({ tag }) => tag === 'user-context-menu'),
  //       map(({ item: { title } }) => title),
  //     )
  //     .subscribe(title => this.window.alert(`${title} was clicked!`));
  }

}
