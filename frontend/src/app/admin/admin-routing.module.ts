import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManageComponent } from './manage/manage.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

const routes: Routes = [
    { path: '', redirectTo: 'manage', pathMatch: 'full' },
    { path: 'manage', component: ManageComponent },
    { path: 'products', component: ManageProductsComponent },
    { path: 'orders', component: ManageOrdersComponent },
    { path: 'users', component: ManageUserComponent }
];

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class AdminRoutingModule { }
