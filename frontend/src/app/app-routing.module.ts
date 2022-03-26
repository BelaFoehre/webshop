import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { AuthGuard } from './auth-guard.service';
import { CartComponent } from './cart/cart.component';
import { hasRoleGuard } from './hasRole-guard.service';

const contentModule = () => import('./content/content.module').then(x => x.ContentModule);
const authModule = () => import('./auth/auth.module').then(x => x.NgxAuthModule);

const routes: Routes = [
  { path: '', redirectTo: '/content', pathMatch: 'full' },
  { path: 'content', loadChildren: contentModule, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: authModule },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard, hasRoleGuard], data: { role: 'Consumer'} },
  { path: 'test', component: AddProductComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
