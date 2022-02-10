import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ShopCardsComponent } from './shop-cards/shop-cards.component';

const routes: Routes = [
    { path: '', component: ShopCardsComponent }
];

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class ContentRoutingModule { }