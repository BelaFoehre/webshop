import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
    { path: 'add', component: AddProductComponent },
    { path: 'manage', component: ManageComponent },
    { path: 'products', component: ManageProductsComponent },
    { path: 'orders', component: ManageOrdersComponent }
];

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class AdminRoutingModule { }
