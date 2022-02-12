import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  items: NbMenuItem[] = [
    {
      title: 'Profile',
      children: [
        {
          title: 'Change Password',
        }
      ],
    },
    {
      title: 'Shopping Bag',
      children: [
        {
          title: 'First Product',
        }
      ],
    }
  ];
  title = 'frontend';
}
