import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product/add-product.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { AdminRoutingModule } from './admin-routing.module'
import { NbButtonModule, NbCardModule, NbInputModule, NbTagModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddProductComponent,
    ManageProductsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NbCardModule,
    NbTagModule,
    FormsModule,
    NbInputModule,
    NbTreeGridModule,
    NbButtonModule
  ],
  exports: [
    AddProductComponent,
    ManageProductsComponent
  ]
})
export class AdminModule { }