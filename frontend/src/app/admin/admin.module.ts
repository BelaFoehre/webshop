import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { AdminRoutingModule } from './admin-routing.module'
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbMenuModule, NbSpinnerModule, NbTagModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ManageComponent } from './manage/manage.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { EditOrderStatusComponent } from './edit-order-status/edit-order-status.component';
import { LockUserComponent } from './lock-user/lock-user.component';



@NgModule({
  declarations: [
    ManageProductsComponent,
    ManageOrdersComponent,
    EditProductComponent,
    ManageComponent,
    ManageUserComponent,
    EditOrderStatusComponent,
    LockUserComponent
  ],
  imports: [
    NbMenuModule,
    CommonModule,
    AdminRoutingModule,
    NbCardModule,
    NbTagModule,
    FormsModule,
    NbInputModule,
    NbSpinnerModule,
    NbTreeGridModule,
    NbButtonModule,
    NbIconModule
  ],
  exports: [
    ManageProductsComponent,
    ManageOrdersComponent
  ]
})
export class AdminModule { }
