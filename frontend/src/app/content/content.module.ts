import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopCardsComponent } from './shop-cards/shop-cards.component';
import { NbCardModule, NbButtonModule, NbIconModule, NbTreeGridModule, NbSpinnerModule, NbInputModule } from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { ContentRoutingModule } from './content-routing.module';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { ProductsComponent } from './products/products.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ShopCardsComponent,
    DetailViewComponent,
    ProductsComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    NbSpinnerModule,
    NbTreeGridModule,
    NbInputModule,
    NbCardModule,
    RouterModule,
    ContentRoutingModule,
    NbButtonModule,
    NbIconModule,
    FormsModule
  ],
  exports: [
    ShopCardsComponent
  ]
})
export class ContentModule { }
