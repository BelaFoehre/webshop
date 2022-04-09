import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product/add-product.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { AdminRoutingModule } from './admin-routing.module'
import { NbCardModule, NbInputModule, NbTagModule } from '@nebular/theme';
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
    NbInputModule
  ],
  exports: [
    AddProductComponent,
    ManageProductsComponent
  ]
})
export class AdminModule { }
