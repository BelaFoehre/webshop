import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopCardsComponent } from './shop-cards/shop-cards.component';
import { NbCardModule, NbButtonModule, NbIconModule, NbTreeGridModule, NbSpinnerModule } from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { ContentRoutingModule } from './content-routing.module';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { ProductsComponent } from './products/products.component';


@NgModule({
  declarations: [
    ShopCardsComponent,
    DetailViewComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    NbSpinnerModule,
    NbTreeGridModule,
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
