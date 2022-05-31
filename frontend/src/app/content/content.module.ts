import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopCardsComponent } from './shop-cards/shop-cards.component';
import { NbCardModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { ContentRoutingModule } from './content-routing.module';
import { DetailViewComponent } from './detail-view/detail-view.component';


@NgModule({
  declarations: [
    ShopCardsComponent,
    DetailViewComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    RouterModule,
    ContentRoutingModule,
    NbButtonModule,
    NbIconModule
  ],
  exports: [
    ShopCardsComponent
  ]
})
export class ContentModule { }
