import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product/add-product.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { AdminRoutingModule } from './admin-routing.module'
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbMenuModule, NbTagModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ManageComponent } from './manage/manage.component';



@NgModule({
  declarations: [
    AddProductComponent,
    ManageProductsComponent,
    ManageOrdersComponent,
    EditProductComponent,
    ManageComponent
  ],
  imports: [
    NbMenuModule,
    CommonModule,
    AdminRoutingModule,
    NbCardModule,
    NbTagModule,
    FormsModule,
    NbInputModule,
    NbTreeGridModule,
    NbButtonModule,
    NbIconModule
  ],
  exports: [
    AddProductComponent,
    ManageProductsComponent,
    ManageOrdersComponent
  ]
})
export class AdminModule { }
