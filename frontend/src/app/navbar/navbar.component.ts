import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  items: NbMenuItem[] = [
    {
      title: 'Home',
      icon: 'home-outline',
      link: ''
    },
    {
      title: 'Github',
      icon: 'github-outline',
      url: 'https://github.com/BelaFoehre/webshop',
      target: '_blank'
    }
  ];

}
