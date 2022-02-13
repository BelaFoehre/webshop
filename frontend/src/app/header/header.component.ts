import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { NbAuthJWTToken, NbAuthService, NbAuthSimpleToken, NbAuthToken } from '@nebular/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user_name: string = "Manuel Neuer"
  user_description: string = "chef"
  user_avatar: string = ""

  constructor(
    private readonly sidebarService: NbSidebarService,
    private readonly authService: NbAuthService
  ) {
    this.authService.onTokenChange().subscribe((token) => {
      if(token.isValid()){
        let payload = token.getPayload()
        this.user_name = payload.user_name
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

  ngOnInit(): void {
  }

}
