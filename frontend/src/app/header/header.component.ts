import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private readonly sidebarService: NbSidebarService
  ) { }

      /**
   * Toggles the animation for the sidebar to open or close it.
   * @returns `false` 
   */
       toggleSidebar(): boolean {
        this.sidebarService.toggle();
        return false;
      }

  ngOnInit(): void { }

}