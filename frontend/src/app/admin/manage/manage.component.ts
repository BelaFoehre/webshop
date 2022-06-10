import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent {

  constructor() { }

  items: NbMenuItem[] = [
    {
      title: 'Produkte',
      icon: 'layers-outline',
      link: '/admin/products',
    },
    {
      title: 'Nutzer',
      icon: 'person-outline',
      link: '/admin/users',
    },
    {
      title: 'Bestellungen',
      icon: 'shopping-cart-outline',
      link: '/admin/orders',
    }
  ];
}
